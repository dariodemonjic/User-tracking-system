// server.js
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const useragent = require('useragent');
const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(express.text({ type: 'text/plain' }));
app.use(express.json({ type: 'application/json' }));

// handle beacon requests
app.use((req, res, next) => {
    if (req.is('text/plain') || req.is('application/json')) {
        if (typeof req.body === 'string') {
            try {
                req.body = JSON.parse(req.body);
            } catch (e) {
                // just continue if it fails
            }
        }
    }
    next();
});

// make sure screenshots folder exists
const screenshotsDir = path.join(__dirname, 'screenshots');
fs.mkdir(screenshotsDir, { recursive: true }).catch(() => {});

// db connection
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'web_analytics',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

function parseUserAgent(userAgentString) {
    const agent = useragent.parse(userAgentString);
    return {
        browser: agent.toAgent(),
        os: agent.os.toString(),
        device: agent.device.toString()
    };
}

function getDeviceType(userAgentString) {
    const ua = userAgentString.toLowerCase();
    if (/mobile|android|iphone/.test(ua)) return 'mobile';
    if (/tablet|ipad/.test(ua)) return 'tablet';
    return 'desktop';
}

// get sessions with activity
app.get('/api/analytics/sessions-with-activity', async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const [sessions] = await connection.execute(
            `SELECT 
                s.id as session_id,
                s.user_id,
                s.device_type,
                s.browser,
                s.created_at,
                COUNT(DISTINCT pv.id) as page_views,
                COUNT(DISTINCT ce.id) as clicks,
                MAX(se.max_scroll_percentage) as max_scroll,
                MAX(TIMESTAMPDIFF(SECOND, s.created_at, pv.exit_time)) as session_duration,
                MIN(pv.page_path) as page_path
             FROM sessions s
             LEFT JOIN page_views pv ON s.id = pv.session_id
             LEFT JOIN click_events ce ON s.id = ce.session_id
             LEFT JOIN scroll_events se ON s.id = se.session_id
             WHERE s.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
             GROUP BY s.id
             ORDER BY s.created_at DESC
             LIMIT 100`
        );
        
        res.json(sessions);
    } catch (error) {
        console.error('Sessions error:', error);
        res.status(500).json({ error: 'Failed to fetch sessions' });
    } finally {
        connection.release();
    }
});

// session events for replay
app.get('/api/analytics/session-events/:sessionId', async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const sessionId = req.params.sessionId;
        
        const [events] = await connection.execute(
            `(SELECT 
                'pageview' as type,
                pv.entry_time as timestamp,
                pv.page_path as page,
                pv.page_title as title,
                NULL as x_percentage,
                NULL as y_percentage,
                NULL as scroll_percentage,
                NULL as element
             FROM page_views pv
             WHERE pv.session_id = ?)
             
             UNION ALL
             
             (SELECT 
                'click' as type,
                ce.timestamp,
                NULL as page,
                NULL as title,
                (ce.x_position / (SELECT MAX(x_position) FROM click_events WHERE session_id = ?) * 100) as x_percentage,
                (ce.y_position / (SELECT MAX(y_position) FROM click_events WHERE session_id = ?) * 100) as y_percentage,
                NULL as scroll_percentage,
                CONCAT(ce.element_type, '#', ce.element_id, '.', ce.element_class) as element
             FROM click_events ce
             WHERE ce.session_id = ?)
             
             UNION ALL
             
             (SELECT 
                'scroll' as type,
                se.timestamp,
                NULL as page,
                NULL as title,
                NULL as x_percentage,
                NULL as y_percentage,
                se.max_scroll_percentage as scroll_percentage,
                NULL as element
             FROM scroll_events se
             WHERE se.session_id = ?)
             
             ORDER BY timestamp`,
            [sessionId, sessionId, sessionId, sessionId, sessionId]
        );
        
        res.json(events);
    } catch (error) {
        console.error('Session events error:', error);
        res.status(500).json({ error: 'Failed to fetch session events' });
    } finally {
        connection.release();
    }
});

app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date() });
});

// screenshot endpoint
app.post('/api/screenshot', async (req, res) => {
    try {
        const { url, pagePath } = req.body;
        
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        console.log(`Taking screenshot of: ${url}`);
        
        const browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu'
            ]
        });

        const page = await browser.newPage();
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if (req.url().includes('/api/track') || req.url().includes('localhost:3001')) {
                console.log('Blocking tracking request:', req.url());
                req.abort();
            } else {
                req.continue();
            }
        });
        
        await page.setViewport({ 
            width: 1920, 
            height: 1080,
            deviceScaleFactor: 1
        });
        
        await page.goto(url, { 
            waitUntil: 'networkidle2',
            timeout: 30000 
        });

        // wait a bit for page to setttle
        await new Promise(resolve => setTimeout(resolve, 2000));

        const screenshotBuffer = await page.screenshot({
            fullPage: true,
            type: 'png'
        });

        await browser.close();

        const filename = `${pagePath.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.png`;
        const filepath = path.join(screenshotsDir, filename);
        await fs.writeFile(filepath, screenshotBuffer);

        // save to db
        const connection = await pool.getConnection();
        try {
            await connection.execute(
                `INSERT INTO page_screenshots (
                    page_path, url, filename, screenshot_date, file_size
                ) VALUES (?, ?, ?, NOW(), ?)
                ON DUPLICATE KEY UPDATE
                    filename = VALUES(filename),
                    screenshot_date = VALUES(screenshot_date),
                    file_size = VALUES(file_size)`,
                [pagePath, url, filename, screenshotBuffer.length]
            );
        } finally {
            connection.release();
        }

        console.log(`Screenshot saved: ${filename}`);
        
        res.json({
            success: true,
            filename: filename,
            size: screenshotBuffer.length,
            path: `/api/screenshot/${filename}`
        });

    } catch (error) {
        console.error('Screenshot error:', error);
        res.status(500).json({ 
            error: 'Failed to take screenshot',
            details: error.message 
        });
    }
});

// serve screenshots
app.get('/api/screenshot/:filename', (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(screenshotsDir, filename);
    
    res.sendFile(filepath, (err) => {
        if (err) {
            console.error('Error serving screenshot:', err);
            res.status(404).json({ error: 'Screenshot not found' });
        }
    });
});

app.get('/api/screenshot-info/:pagePath', async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const pagePath = decodeURIComponent(req.params.pagePath);
        
        const [screenshots] = await connection.execute(
            `SELECT filename, screenshot_date, file_size, url
             FROM page_screenshots 
             WHERE page_path = ?
             ORDER BY screenshot_date DESC
             LIMIT 1`,
            [pagePath]
        );
        
        if (screenshots.length === 0) {
            return res.status(404).json({ error: 'No screenshot found for this page' });
        }
        
        res.json(screenshots[0]);
    } finally {
        connection.release();
    }
});

app.get('/api/screenshots', async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const [screenshots] = await connection.execute(
            `SELECT page_path, filename, screenshot_date, file_size, url
             FROM page_screenshots 
             ORDER BY screenshot_date DESC`
        );
        
        res.json(screenshots);
    } finally {
        connection.release();
    }
});

// main tracking endpoint
app.post('/api/track', async (req, res) => {
    try {
        const { eventType, data, timestamp } = req.body;
        const clientIp = req.ip || req.connection.remoteAddress;
        
        console.log(`[${new Date().toISOString()}] Event: ${eventType}`);
        
        switch (eventType) {
            case 'session':
                await handleSession(data, clientIp);
                break;
            case 'pageview':
                const pageViewId = await handlePageView(data);
                res.json({ pageViewId });
                return;
            case 'click':
                await handleClick(data);
                break;
            case 'scroll':
                await handleScroll(data);
                break;
            case 'form':
                await handleForm(data);
                break;
            case 'heatmap':
                await handleHeatmap(data);
                break;
        
            case 'timeonpage':
                await handleTimeOnPage(data);
                break;
            default:
                console.log('Unknown event type:', eventType);
        }
        
        res.json({ success: true });
    } catch (error) {
        console.error('Tracking error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

async function handleSession(data, clientIp) {
    console.log('=== SESSION RECEIVED ===');
    console.log('User ID:', data.userId);
    console.log('Session ID:', data.sessionId);
    console.log('Has User ID?', !!data.userId);
    
    const connection = await pool.getConnection();
    try {
        const ua = parseUserAgent(data.userAgent);
        
        // genrate user id if needed
        const userId = data.userId || `generated_${data.sessionId.substring(0, 8)}`;
        
        await connection.execute(
            `INSERT INTO sessions (
                id, user_id, ip_address, user_agent, browser, os, device_type,
                screen_width, screen_height, viewport_width, viewport_height,
                referrer, utm_source, utm_medium, utm_campaign
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                updated_at = CURRENT_TIMESTAMP,
                user_id = COALESCE(user_id, VALUES(user_id))`,
            [
                data.sessionId,
                userId,
                clientIp,
                data.userAgent,
                ua.browser,
                ua.os,
                getDeviceType(data.userAgent),
                data.screenWidth,
                data.screenHeight,
                data.viewportWidth,
                data.viewportHeight,
                data.referrer || null,
                data.utmSource || null,
                data.utmMedium || null,
                data.utmCampaign || null
            ]
        );
        
        console.log('Session saved with User ID:', userId);
    } catch (error) {
        console.error('Session save error:', error);
    } finally {
        connection.release();
    }
}

async function handlePageView(data) {
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.execute(
            `INSERT INTO page_views (
                session_id, page_url, page_title, page_path
            ) VALUES (?, ?, ?, ?)`,
            [
                data.sessionId,
                data.pageUrl,
                data.pageTitle,
                data.pagePath
            ]
        );
        console.log('Page view created with ID:', result.insertId);
        return result.insertId;
    } finally {
        connection.release();
    }
}

async function handleClick(data) {
    const connection = await pool.getConnection();
    try {
        await connection.execute(
            `INSERT INTO click_events (
                session_id, page_view_id, element_type, element_id, element_class,
                element_text, x_position, y_position, viewport_x, viewport_y
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.sessionId,
                data.pageViewId,
                data.elementType,
                data.elementId,
                data.elementClass,
                data.elementText,
                data.xPosition,
                data.yPosition,
                data.viewportX,
                data.viewportY
            ]
        );
    } finally {
        connection.release();
    }
}

async function handleScroll(data) {
    const connection = await pool.getConnection();
    try {
        await connection.execute(
            `INSERT INTO scroll_events (
                session_id, page_view_id, max_scroll_depth, max_scroll_percentage, scroll_count
            ) VALUES (?, ?, ?, ?, 1)
            ON DUPLICATE KEY UPDATE
                max_scroll_depth = GREATEST(max_scroll_depth, VALUES(max_scroll_depth)),
                max_scroll_percentage = GREATEST(max_scroll_percentage, VALUES(max_scroll_percentage)),
                scroll_count = scroll_count + 1`,
            [
                data.sessionId,
                data.pageViewId,
                data.maxScrollDepth,
                data.maxScrollPercentage
            ]
        );
    } finally {
        connection.release();
    }
}

async function handleForm(data) {
    const connection = await pool.getConnection();
    try {
        await connection.execute(
            `INSERT INTO form_events (
                session_id, page_view_id, form_id, form_name, field_name,
                field_type, interaction_type, time_to_interact
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.sessionId,
                data.pageViewId,
                data.formId || '',
                data.formName || '',
                data.fieldName || '',
                data.fieldType || '',
                data.interactionType,
                data.timeToInteract
            ]
        );
    } finally {
        connection.release();
    }
}


async function handleHeatmap(data) {
    const connection = await pool.getConnection();
    try {
        const today = new Date().toISOString().split('T')[0];
        
        await connection.execute(
            `INSERT INTO heatmap_data (
                page_path, element_selector, x_percentage, y_percentage, date
            ) VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                click_count = click_count + 1`,
            [
                data.pagePath,
                data.elementSelector || '',
                data.xPercentage,
                data.yPercentage,
                today
            ]
        );
    } finally {
        connection.release();
    }
}


async function handleTimeOnPage(data) {
    console.log('Time on page update:', data.pageViewId, '=', data.timeOnPage, 'seconds');
    
    const connection = await pool.getConnection();
    try {
        await connection.execute(
            `UPDATE page_views 
             SET time_on_page = ?, exit_time = CURRENT_TIMESTAMP, exit_page = 1
             WHERE id = ?`,
            [data.timeOnPage, data.pageViewId]
        );
        console.log('Updated page view', data.pageViewId, 'with time:', data.timeOnPage);
    } finally {
        connection.release();
    }
}

// analytics endpoints for dashbaord
app.get('/api/analytics/overview', async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { startDate, endDate } = req.query;
        
        const [overview] = await connection.execute(
            `SELECT 
                COUNT(DISTINCT s.id) as total_sessions,
                COUNT(DISTINCT s.user_id) as unique_visitors,
                COUNT(DISTINCT pv.id) as total_page_views,
                AVG(pv.time_on_page) as avg_time_on_page,
                COALESCE(
                    ROUND(
                        (SUM(CASE 
                            WHEN session_stats.page_count = 1 
                                AND session_stats.click_count = 0 
                                AND session_stats.max_scroll < 25
                                AND session_stats.avg_time < 10
                            THEN 1 
                            ELSE 0 
                        END) / NULLIF(COUNT(DISTINCT s.id), 0)) * 100,
                        2
                    ), 
                    0
                ) as bounce_rate
             FROM sessions s
             LEFT JOIN page_views pv ON s.id = pv.session_id
             LEFT JOIN (
                SELECT 
                    s2.id as session_id,
                    COUNT(DISTINCT pv2.id) as page_count,
                    COUNT(DISTINCT ce.id) as click_count,
                    COALESCE(MAX(se.max_scroll_percentage), 0) as max_scroll,
                    COALESCE(AVG(pv2.time_on_page), 0) as avg_time
                FROM sessions s2
                LEFT JOIN page_views pv2 ON s2.id = pv2.session_id
                LEFT JOIN click_events ce ON s2.id = ce.session_id
                LEFT JOIN scroll_events se ON s2.id = se.session_id
                WHERE DATE(s2.created_at) BETWEEN ? AND ?
                GROUP BY s2.id
             ) as session_stats ON s.id = session_stats.session_id
             WHERE DATE(s.created_at) BETWEEN ? AND ?`,
            [
                startDate || '2024-01-01',
                endDate || new Date().toISOString().split('T')[0],
                startDate || '2024-01-01',
                endDate || new Date().toISOString().split('T')[0]
            ]
        );
         if (overview[0]) {
            overview[0].bounce_rate = parseFloat(overview[0].bounce_rate) || 0;
         }
        
        res.json(overview[0]);
    } catch (error) {
        console.error('Overview error:', error);
        res.status(500).json({ error: 'Failed to fetch overview' });
    } finally {
        connection.release();
    }
});

app.get('/api/analytics/pageviews', async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { startDate, endDate } = req.query;
        
        const [pageviews] = await connection.execute(
            `SELECT 
                DATE_FORMAT(entry_time, '%Y-%m-%d') as date,
                COUNT(*) as pageviews,
                COUNT(DISTINCT session_id) as sessions
             FROM page_views
             WHERE DATE(entry_time) BETWEEN ? AND ?
             GROUP BY DATE_FORMAT(entry_time, '%Y-%m-%d')
             ORDER BY date`,
            [startDate || '2024-01-01', endDate || new Date().toISOString().split('T')[0]]
        );
        
        res.json(pageviews);
    } catch (error) {
        console.error('Pageviews error:', error);
        res.status(500).json({ error: 'Failed to fetch pageviews' });
    } finally {
        connection.release();
    }
});

app.get('/api/analytics/top-pages', async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { startDate, endDate, limit = 10 } = req.query;
        
        const queryStartDate = startDate || '2024-01-01';
        const queryEndDate = endDate || new Date().toISOString().split('T')[0];
        const queryLimit = parseInt(limit, 10) || 10;
        
        const sql = `SELECT 
            page_path,
            page_title,
            COUNT(*) as views,
            COUNT(DISTINCT session_id) as unique_views,
            AVG(time_on_page) as avg_time_on_page
         FROM page_views
         WHERE DATE(entry_time) BETWEEN ? AND ?
         AND page_path IS NOT NULL
         GROUP BY page_path, page_title
         ORDER BY views DESC
         LIMIT ${queryLimit}`;
        
        const [pages] = await connection.execute(sql, [queryStartDate, queryEndDate]);
        
        res.json(pages);
    } catch (error) {
        console.error('Top pages error:', error.message);
        res.status(500).json({ error: 'Failed to fetch top pages', details: error.message });
    } finally {
        connection.release();
    }
});

app.get('/api/analytics/sources', async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { startDate, endDate } = req.query;
        
        const [sources] = await connection.execute(
            `SELECT 
                CASE 
                    WHEN referrer IS NULL OR referrer = '' THEN 'Direct'
                    WHEN referrer LIKE '%google%' THEN 'Google'
                    WHEN referrer LIKE '%facebook%' THEN 'Facebook'
                    WHEN referrer LIKE '%twitter%' THEN 'Twitter'
                    ELSE 'Other'
                END as source,
                COUNT(*) as sessions,
                COUNT(DISTINCT user_id) as users
             FROM sessions
             WHERE DATE(created_at) BETWEEN ? AND ?
             GROUP BY source
             ORDER BY sessions DESC`,
            [startDate || '2024-01-01', endDate || new Date().toISOString().split('T')[0]]
        );
        
        res.json(sources);
    } catch (error) {
        console.error('Sources error:', error);
        res.status(500).json({ error: 'Failed to fetch sources' });
    } finally {
        connection.release();
    }
});

app.get('/api/analytics/devices', async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { startDate, endDate } = req.query;
        
        const [devices] = await connection.execute(
            `SELECT 
                device_type,
                browser,
                os,
                COUNT(*) as sessions,
                COUNT(DISTINCT user_id) as users
             FROM sessions
             WHERE DATE(created_at) BETWEEN ? AND ?
             GROUP BY device_type, browser, os
             ORDER BY sessions DESC`,
            [startDate || '2024-01-01', endDate || new Date().toISOString().split('T')[0]]
        );
        
        res.json(devices);
    } catch (error) {
        console.error('Devices error:', error);
        res.status(500).json({ error: 'Failed to fetch devices' });
    } finally {
        connection.release();
    }
});

app.get('/api/analytics/heatmap', async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { pagePath, date } = req.query;
        
        const [heatmapData] = await connection.execute(
            `SELECT 
                x_percentage,
                y_percentage,
                click_count,
                element_selector
             FROM heatmap_data
             WHERE page_path = ? AND date = ?
             ORDER BY click_count DESC`,
            [pagePath, date || new Date().toISOString().split('T')[0]]
        );
        
        res.json(heatmapData);
    } catch (error) {
        console.error('Heatmap error:', error);
        res.status(500).json({ error: 'Failed to fetch heatmap' });
    } finally {
        connection.release();
    }
});

// get scroll depth data
app.get('/api/analytics/scroll-depth', async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { pagePath, startDate, endDate } = req.query;
        
        console.log('Fetching scroll depth for:', { pagePath, startDate, endDate });
        
        const [scrollData] = await connection.execute(
            `SELECT 
                se.max_scroll_percentage
             FROM scroll_events se
             JOIN page_views pv ON se.page_view_id = pv.id
             WHERE se.max_scroll_percentage > 0
             AND DATE(se.timestamp) BETWEEN ? AND ?
             ${pagePath ? 'AND pv.page_path = ?' : ''}
             ORDER BY se.timestamp DESC`,
            pagePath 
                ? [startDate || '2024-01-01', endDate || new Date().toISOString().split('T')[0], pagePath]
                : [startDate || '2024-01-01', endDate || new Date().toISOString().split('T')[0]]
        );
        
        console.log(`Found ${scrollData.length} scroll events for ${pagePath || 'all pages'}`);
        
        // calculate distributtion
        const distribution = [];
        const total = scrollData.length;
        
        if (total > 0) {
            for (let depth = 0; depth <= 100; depth += 10) {
                const usersAtDepth = scrollData.filter(row => 
                    row.max_scroll_percentage >= depth
                ).length;
                
                distribution.push({
                    depth: depth,
                    percentage: total > 0 ? (usersAtDepth / total) * 100 : 0,
                    users: usersAtDepth
                });
            }
        } else {
            // default if no data
            for (let depth = 0; depth <= 100; depth += 10) {
                distribution.push({
                    depth: depth,
                    percentage: 0,
                    users: 0
                });
            }
        }
        
        console.log('Scroll depth distribution:', distribution);
        res.json(distribution);
    } catch (error) {
        console.error('Scroll depth error:', error);
        res.status(500).json({ error: 'Failed to fetch scroll depth data' });
    } finally {
        connection.release();
    }
});

// scroll depth by unique users
app.get('/api/analytics/scroll-depth-users', async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { pagePath, startDate, endDate } = req.query;
        
        console.log('Fetching scroll depth by unique users for:', { pagePath, startDate, endDate });
        
        const [scrollData] = await connection.execute(
            `SELECT 
                s.user_id,
                MAX(se.max_scroll_percentage) as max_scroll_percentage
             FROM scroll_events se
             JOIN page_views pv ON se.page_view_id = pv.id
             JOIN sessions s ON se.session_id = s.id
             WHERE se.max_scroll_percentage > 0
             AND DATE(se.timestamp) BETWEEN ? AND ?
             ${pagePath ? 'AND pv.page_path = ?' : ''}
             AND s.user_id IS NOT NULL
             GROUP BY s.user_id`,
            pagePath 
                ? [startDate || '2024-01-01', endDate || new Date().toISOString().split('T')[0], pagePath]
                : [startDate || '2024-01-01', endDate || new Date().toISOString().split('T')[0]]
        );
        
        console.log(`Found ${scrollData.length} unique users with scroll data for ${pagePath || 'all pages'}`);
        
        const distribution = [];
        const totalUsers = scrollData.length;
        
        if (totalUsers > 0) {
            for (let depth = 0; depth <= 100; depth += 10) {
                const usersAtDepth = scrollData.filter(row => 
                    row.max_scroll_percentage >= depth
                ).length;
                
                distribution.push({
                    depth: depth,
                    percentage: (usersAtDepth / totalUsers) * 100,
                    users: usersAtDepth
                });
            }
        } else {
            for (let depth = 0; depth <= 100; depth += 10) {
                distribution.push({
                    depth: depth,
                    percentage: 0,
                    users: 0
                });
            }
        }
        
        console.log('Scroll depth distribution by unique users:', distribution);
        res.json(distribution);
    } catch (error) {
        console.error('Scroll depth users error:', error);
        res.status(500).json({ error: 'Failed to fetch scroll depth data by users' });
    } finally {
        connection.release();
    }
});

// realtime data
app.get('/api/analytics/realtime', async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        
        const [realtime] = await connection.execute(
            `SELECT 
                COUNT(DISTINCT s.id) as active_users,
                COUNT(pv.id) as recent_pageviews
             FROM sessions s
             LEFT JOIN page_views pv ON s.id = pv.session_id
             WHERE s.created_at >= ? OR pv.entry_time >= ?`,
            [fiveMinutesAgo, fiveMinutesAgo]
        );
        
        res.json(realtime[0] || { active_users: 0, recent_pageviews: 0 });
    } catch (error) {
        console.error('Realtime error:', error);
        res.status(500).json({ error: 'Failed to fetch realtime data' });
    } finally {
        connection.release();
    }
});

// debug endpoint
app.get('/api/debug/sessions', async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const [sessions] = await connection.execute(
            `SELECT 
                id as session_id,
                user_id,
                browser,
                device_type,
                created_at
             FROM sessions 
             ORDER BY created_at DESC 
             LIMIT 10`
        );
        
        const [stats] = await connection.execute(
            `SELECT 
                COUNT(DISTINCT user_id) as unique_users,
                COUNT(DISTINCT id) as total_sessions,
                COUNT(CASE WHEN user_id IS NULL THEN 1 END) as null_users,
                COUNT(CASE WHEN user_id IS NOT NULL THEN 1 END) as with_users
             FROM sessions`
        );
        
        res.json({
            recent_sessions: sessions,
            statistics: stats[0]
        });
    } finally {
        connection.release();
    }
});

// click data for heatmap
app.get('/api/analytics/clicks', async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { pagePath, startDate, endDate } = req.query;
        
        const [heatmapData] = await connection.execute(
    `SELECT 
        x_percentage,
        y_percentage,
        click_count
     FROM heatmap_data
     WHERE page_path = ?
     AND date BETWEEN ? AND ?`,
    [
        pagePath || '/home',
        startDate || '2024-01-01',
        endDate || new Date().toISOString().split('T')[0]
    ]
);
        
        res.json(heatmapData);
    } catch (error) {
        console.error('Click data error:', error);
        res.status(500).json({ error: 'Failed to fetch click data' });
    } finally {
        connection.release();
    }
});

// test screenshot endpoint
app.get('/test-screenshot', async (req, res) => {
    console.log('Testing screenshot functionality...');
    try {
        const browser = await puppeteer.launch({ 
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        console.log('Navigating to: http://127.0.0.1:5500/test.html');
        
        await page.goto('http://127.0.0.1:5500/test.html', { 
            waitUntil: 'networkidle2',
            timeout: 10000 
        });
        
        console.log('Page loaded successfully');
        await new Promise(resolve => setTimeout(resolve, 3000));
        await browser.close();
        
        res.json({ success: true, message: 'Screenshot test successful' });
    } catch (error) {
        console.error('Screenshot test failed:', error.message);
        res.json({ error: error.message });
    }
});

// form analytics
app.get('/api/analytics/forms', async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { startDate, endDate } = req.query;
        
        // field 
    
        const [fieldPerformance] = await connection.execute(`
            SELECT 
                field_type,
                COUNT(*) as interactions,
                AVG(time_to_interact / 1000) as avgTime,
                (COUNT(CASE WHEN interaction_type = 'blur' THEN 1 END) / 
                 NULLIF(COUNT(CASE WHEN interaction_type = 'focus' THEN 1 END), 0)) * 100 as completionRate
            FROM form_events 
            WHERE DATE(timestamp) BETWEEN ? AND ?
            AND field_type IS NOT NULL AND field_type != ''
            GROUP BY field_type
        `, [startDate || '2024-01-01', endDate || new Date().toISOString().split('T')[0]]);

        // form completeion rates
        const [formCompletion] = await connection.execute(`
            SELECT 
                form_name,
                COUNT(DISTINCT CASE WHEN interaction_type = 'focus' THEN session_id END) as started,
                COUNT(DISTINCT CASE WHEN interaction_type = 'submit' THEN session_id END) as completed
            FROM form_events 
            WHERE DATE(timestamp) BETWEEN ? AND ?
            AND form_name IS NOT NULL AND form_name != ''
            GROUP BY form_name
        `, [startDate || '2024-01-01', endDate || new Date().toISOString().split('T')[0]]);

        const formCompletionRates = formCompletion.map(form => ({
            formName: form.form_name,
            started: form.started,
            completed: form.completed,
            rate: form.started > 0 ? (form.completed / form.started) * 100 : 0
        }));

        res.json({
            fieldPerformance: fieldPerformance || [],
            formCompletionRates: formCompletionRates || [],
            interactionTimes: [],
            abandonmentPoints: []
        });
    } catch (error) {
        console.error('Form analytics error:', error);
        res.status(500).json({ error: 'Failed to fetch form analytics' });
    } finally {
        connection.release();
    }
});

// start server
app.listen(PORT, () => {
    console.log(`
     Analytics server running!
     API: http://localhost:${PORT}
     Health check: http://localhost:${PORT}/health
     Debug: http://localhost:${PORT}/api/debug/sessions
    Screenshots: http://localhost:${PORT}/api/screenshots
    Test Screenshot: http://localhost:${PORT}/test-screenshot
    `);
    
    // test db connection
    pool.getConnection()
        .then(connection => {
            console.log(' Database connected successfully');
            connection.release();
        })
        .catch(err => {
            console.error(' Database connection failed:', err.message);
            console.log('Please check your .env file and WAMP server');
        });
});