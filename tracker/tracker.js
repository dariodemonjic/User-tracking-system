(function(window, document) {
    'use strict';

    const config = {
        apiEndpoint: 'http://localhost:3001/api/track',
        sessionTimeout: 30 * 60 * 1000, // 30 min
        scrollThreshold: 25,
        debounceDelay: 500,
        enableAutoTracking: true,
        storagePrefix: 'wt_',
        isSPA: false
    };

    const WebTracker = {
        sessionId: null,
        userId: null,
        pageViewId: null,gi
        startTime: Date.now(),
        lastActivity: Date.now(),
        scrollDepth: 0,
        clicks: [],
        errors: [],
        
        currentPageStartTime: null,
        timeTrackingInterval: null,
        lastTrackedPath: null,
        formInteractionTimes: {},
        
        init: function(options = {}) {
            Object.assign(config, options);
            
            console.log('=== WEBTRACKER INITIALIZATION ===');
            
            this.userId = this.getOrCreateUserId();
            console.log('Step 1 - User ID:', this.userId);
            
            this.sessionId = this.getOrCreateSession();
            console.log('Step 2 - Session ID:', this.sessionId);
            
            if (!this.userId) {
                console.error('CRITICAL ERROR: User ID is not set!');
                this.userId = this.generateUUID();
                this.setStorage('user', this.userId, 365);
            }
            
            if (config.enableAutoTracking) {
                this.attachEventListeners();
                
                if (!config.isSPA) {
                    this.trackPageView();
                } else {
                    console.log('SPA mode: Setting up virtual page tracking');
                    this.setupSPATracking();
                }
            }
            
            
            
            
            console.log('=== TRACKER READY ===');
            console.log('SPA Mode:', config.isSPA);
        },
        
        getPagePath: function() {
            if (config.isSPA) {
                const hash = window.location.hash.replace('#', '') || 'home';
                let path = `/${hash}`;
                
                // standarize homepage
                if (path === '/' || path === '/home') {
                    path = '/home';
                }
                
                return path;
            } else {
                return window.location.pathname;
            }
        },
        
        setupSPATracking: function() {
            // track initial load
            setTimeout(() => {
                this.trackVirtualPageView();
            }, 100);
            
            let lastHash = window.location.hash;
            
            // check for changes
            setInterval(() => {
                const currentHash = window.location.hash;
                if (currentHash !== lastHash) {
                    console.log(`Hash changed from "${lastHash}" to "${currentHash}"`);
                    lastHash = currentHash;
                    this.trackVirtualPageView();
                }
            }, 100);
            
            window.addEventListener('hashchange', () => {
                console.log('Hashchange event detected');
                this.trackVirtualPageView();
            });
            
            window.addEventListener('popstate', () => {
                console.log('Popstate event detected');
                setTimeout(() => this.trackVirtualPageView(), 50);
            });
        },
        
        trackVirtualPageView: function() {
            const currentPath = this.getPagePath();
            
            // prevent duplicates
            if (currentPath === this.lastTrackedPath) {
                console.log(`Already tracking ${currentPath}, skipping duplicate`);
                return;
            }
            
            if (this.pageViewId && this.currentPageStartTime) {
                this.sendTimeForCurrentPage();
            }
            
            const baseUrl = `${window.location.origin}${window.location.pathname}`;
            const hash = window.location.hash || '#home';
            const fullUrl = `${baseUrl}${hash}`;
            
            const pageData = {
                sessionId: this.sessionId,
                pageUrl: fullUrl,
                pageTitle: document.title,
                pagePath: currentPath,
                timestamp: Date.now()
            };
            
            console.log('📄 Tracking virtual page view:', {
                url: fullUrl,
                path: currentPath,
                title: document.title
            });
            
            this.lastTrackedPath = currentPath;
            
            this.sendData('pageview', pageData, (response) => {
                if (response && response.pageViewId) {
                    this.pageViewId = response.pageViewId;
                    this.currentPageStartTime = Date.now();
                    console.log(`✅ Virtual page tracked: ${currentPath} (ID: ${response.pageViewId})`);
                    
                    this.startTimeTracking();
                }
            });
        },
        
        generateUUID: function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                const r = Math.random() * 16 | 0;
                const v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },
        
        setStorage: function(key, value, days) {
            const fullKey = config.storagePrefix + key;
            
            console.log(`STORING ${key}: ${value} as ${fullKey}`);
            
            try {
                const expires = new Date();
                expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
                
                let cookieString = fullKey + '=' + value + 
                                 '; expires=' + expires.toUTCString() + 
                                 '; path=/';
                
                if (window.location.protocol !== 'file:') {
                    cookieString += '; SameSite=Lax';
                }
                
                console.log(`Cookie string: ${cookieString}`);
                document.cookie = cookieString;
                
                setTimeout(() => {
                    console.log(`After setting ${fullKey}, all cookies: ${document.cookie}`);
                }, 100);
                
                console.log(`Stored ${key} in cookie:`, value);
            } catch(e) {
                console.error('Cookie failed:', e);
            }
            
            // localStorage backup
            if (typeof(Storage) !== "undefined") {
                try {
                    const expiry = new Date().getTime() + (days * 24 * 60 * 60 * 1000);
                    localStorage.setItem(fullKey, value);
                    localStorage.setItem(fullKey + '_expiry', expiry);
                } catch(e) {
                    console.warn('localStorage failed:', e);
                }
            }
        },
        
        getStorage: function(key) {
            const fullKey = config.storagePrefix + key;
            
            // check cookies first
            const cookieValue = this.getCookie(fullKey);
            if (cookieValue) {
                // update localstorage backup
                if (typeof(Storage) !== "undefined") {
                    try {
                        localStorage.setItem(fullKey, cookieValue);
                    } catch(e) {
                        // ignore
                    }
                }
                return cookieValue;
            }
            
            // fallback to localStorage
            if (typeof(Storage) !== "undefined") {
                try {
                    const value = localStorage.getItem(fullKey);
                    if (value) {
                        const expiry = localStorage.getItem(fullKey + '_expiry');
                        if (expiry && new Date().getTime() > parseInt(expiry)) {
                            localStorage.removeItem(fullKey);
                            localStorage.removeItem(fullKey + '_expiry');
                            console.log(`${key} expired in localStorage`);
                        } else {
                            return value;
                        }
                    }
                } catch(e) {
                    console.warn('localStorage read failed:', e);
                }
            }
            
            console.log(`No stored value found for ${key}`);
            return null;
        },
        
        getCookie: function(name) {
            const nameEQ = name + '=';
            const ca = document.cookie.split(';');
            
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) === 0) {
                    const value = c.substring(nameEQ.length, c.length);
                    console.log(`Found cookie value: ${value}`);
                    return value;
                }
            }
            console.log(`Cookie ${name} not found`);
            return null;
        },
        
        getOrCreateUserId: function() {
            let userId = this.getStorage('user');
            
            if (!userId) {
                userId = this.generateUUID();
                this.setStorage('user', userId, 365 * 10);
                
                setTimeout(() => {
                    this.trackEvent('User', 'New', 'First Visit', 1);
                }, 1000);
            } else {
                setTimeout(() => {
                    this.trackEvent('User', 'Returning', 'Return Visit', 1);
                }, 1000);
            }
            
            return userId;
        },
        
        getOrCreateSession: function() {
            console.log('=== SESSION STORAGE DEBUG ===');
            console.log('Current domain:', window.location.origin);
            console.log('All localStorage keys:', Object.keys(localStorage));
            console.log('All cookies:', document.cookie);
            
            let sessionId = this.getStorage('session');
            const lastActivity = this.getStorage('last_activity');

            console.log('Found session ID:', sessionId);
            console.log('Found last activity:', lastActivity);
            console.log('Time since last activity:', lastActivity ? Math.round((Date.now() - parseInt(lastActivity)) / 1000) + 's' : 'none');
            
            let needNewSession = false;
            let reason = '';
            
            if (!sessionId) {
                needNewSession = true;
                reason = 'No existing session';
            } else if (!lastActivity) {
                needNewSession = true;
                reason = 'No last activity recorded';
            } else {
                const timeSinceLastActivity = Date.now() - parseInt(lastActivity);
                if (timeSinceLastActivity > config.sessionTimeout) {
                    needNewSession = true;
                    reason = `Session timeout (idle for ${Math.round(timeSinceLastActivity / 60000)} minutes)`;
                }
            }
            
            if (needNewSession) {
                sessionId = this.generateUUID();
                this.setStorage('session', sessionId, 1);
                console.log('📍 NEW SESSION created:', sessionId);
                console.log('   Reason:', reason);
                
                this.createServerSession(sessionId);
            } else {
                const timeSinceLastActivity = Date.now() - parseInt(lastActivity);
                console.log('✅ EXISTING SESSION continued:', sessionId);
                console.log('   Last active:', Math.round(timeSinceLastActivity / 1000), 'seconds ago');
                
                this.updateServerSession(sessionId);
            }
            
            this.setStorage('last_activity', Date.now(), 1);
            return sessionId;
        },
        
        createServerSession: function(sessionId) {
            if (!this.userId) {
                console.error('ERROR: No user ID when creating session!');
                this.userId = this.getOrCreateUserId();
            }
            
            const sessionData = {
                sessionId: sessionId,
                userId: this.userId,
                userAgent: navigator.userAgent,
                screenWidth: screen.width,
                screenHeight: screen.height,
                viewportWidth: window.innerWidth,
                viewportHeight: window.innerHeight,
                referrer: document.referrer,
                ...this.getUTMParams()
            };
            
            console.log('📤 Creating session on server:');
            console.log('   Session ID:', sessionId);
            console.log('   User ID:', this.userId);
            
            this.sendData('session', sessionData);
        },
        
        updateServerSession: function(sessionId) {
            const sessionData = {
                sessionId: sessionId,
                userId: this.userId,
                userAgent: navigator.userAgent
            };
            
            console.log('📤 Updating session on server:');
            console.log('   Session ID:', sessionId);
            console.log('   User ID:', this.userId);
            
            this.sendData('session', sessionData);
        },
        
        getUTMParams: function() {
            const params = new URLSearchParams(window.location.search);
            return {
                utmSource: params.get('utm_source') || '',
                utmMedium: params.get('utm_medium') || '',
                utmCampaign: params.get('utm_campaign') || ''
            };
        },
        
        trackPageView: function() {
            // send time for previus page
            this.sendTimeForCurrentPage();
            
            const pageData = {
                sessionId: this.sessionId,
                pageUrl: window.location.href,
                pageTitle: document.title,
                pagePath: this.getPagePath(),
                timestamp: Date.now()
            };
            
            this.sendData('pageview', pageData, (response) => {
                if (response && response.pageViewId) {
                    this.pageViewId = response.pageViewId;
                    this.currentPageStartTime = Date.now();
                    console.log('📄 Page view tracked, ID:', this.pageViewId);
                    
                    this.startTimeTracking();
                }
            });
        },
        
        sendTimeForCurrentPage: function() {
            if (this.pageViewId && this.currentPageStartTime) {
                const timeOnPage = Math.round((Date.now() - this.currentPageStartTime) / 1000);
                
                // validate reasonable time
                if (timeOnPage > 0 && timeOnPage < 1800) {
                    const timeData = {
                        sessionId: this.sessionId,
                        pageViewId: this.pageViewId,
                        timeOnPage: timeOnPage
                    };
                    
                    const dataStr = JSON.stringify({
                        eventType: 'timeonpage',
                        data: timeData,
                        timestamp: Date.now()
                    });
                    
                    if (navigator.sendBeacon) {
                        navigator.sendBeacon(config.apiEndpoint, dataStr);
                        console.log(`⏱️ Time sent for page ${this.pageViewId}: ${timeOnPage}s`);
                    } else {
                        this.sendData('timeonpage', timeData);
                    }
                } else {
                    console.log(`⚠️ Invalid time (${timeOnPage}s), not sending`);
                }
            }
        },
        
        startTimeTracking: function() {
            if (this.timeTrackingInterval) {
                clearInterval(this.timeTrackingInterval);
            }
            
            const tracker = this;
            
            const sendFinalTime = () => {
                tracker.sendTimeForCurrentPage();
            };
            
            window.removeEventListener('beforeunload', sendFinalTime);
            window.removeEventListener('pagehide', sendFinalTime);
            
            window.addEventListener('beforeunload', sendFinalTime);
            window.addEventListener('pagehide', sendFinalTime);
            
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    tracker.sendTimeForCurrentPage();
                }
            });
            
            // periodic updates
            this.timeTrackingInterval = setInterval(() => {
                if (!document.hidden && tracker.pageViewId && tracker.currentPageStartTime) {
                    const timeOnPage = Math.round((Date.now() - tracker.currentPageStartTime) / 1000);
                    
                    if (timeOnPage > 0 && timeOnPage < 1800) {
                        tracker.sendData('timeonpage', {
                            sessionId: tracker.sessionId,
                            pageViewId: tracker.pageViewId,
                            timeOnPage: timeOnPage
                        });
                        console.log(`⏱️ Periodic time update: ${timeOnPage}s`);
                    }
                }
            }, 30000);
        },
        
        attachEventListeners: function() {
            // click tracking
            document.addEventListener('click', (e) => {
                const target = e.target;
                const clickData = {
                    sessionId: this.sessionId,
                    pageViewId: this.pageViewId,
                    elementType: target.tagName,
                    elementId: target.id || '',
                    elementClass: target.className || '',
                    elementText: target.textContent ? target.textContent.substring(0, 100) : '',
                    xPosition: e.pageX,
                    yPosition: e.pageY,
                    viewportX: e.clientX,
                    viewportY: e.clientY,
                    timestamp: Date.now()
                };
                
                this.sendData('click', clickData);
                this.storeHeatmapData(e);
            });

            // scroll tracking
            let scrollTimer = null;
            let maxScroll = 0;
            let maxScrollDepth = 0;

            window.addEventListener('scroll', () => {
                clearTimeout(scrollTimer);
                
                const currentScrollDepth = window.pageYOffset;
                const scrollPercentage = this.getScrollPercentage();
                
                if (scrollPercentage > maxScroll) {
                    maxScroll = scrollPercentage;
                }
                if (currentScrollDepth > maxScrollDepth) {
                    maxScrollDepth = currentScrollDepth;
                }
                
                scrollTimer = setTimeout(() => {
                    // only send if we have page view id
                    if (this.pageViewId) {
                        console.log(`📜 Scroll event: ${maxScroll}% on page ${this.getPagePath()}`);
                        
                        this.sendData('scroll', {
                            sessionId: this.sessionId,
                            pageViewId: this.pageViewId,
                            maxScrollDepth: maxScrollDepth,
                            maxScrollPercentage: maxScroll,
                            timestamp: Date.now()
                        });
                    } else {
                        console.warn('⚠️ Scroll event ignored - no page view ID');
                    }
                }, config.debounceDelay);
            });

            // form tracking
            document.addEventListener('focus', (e) => {
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
                    this.trackFormInteraction(e, 'focus');
                }
            }, true);
            
            document.addEventListener('blur', (e) => {
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
                    this.trackFormInteraction(e, 'blur');
                }
            }, true);
            
            document.addEventListener('submit', (e) => {
                if (e.target.tagName === 'FORM') {
                    this.trackFormInteraction(e, 'submit');
                }
            });
        },
         
      
        trackFormInteraction: function(event, interactionType) {
            const target = event.target;
            
            let actualForm;
            if (interactionType === 'submit') {
                actualForm = target;
            } else {
                actualForm = target.form || target.closest('form');
            }
            
            const fieldKey = `${actualForm?.id || 'form'}_${target.name || target.id || 'field'}`;
            
            let timeToInteract = 0;
            
            if (interactionType === 'focus') {
                this.formInteractionTimes[fieldKey] = Date.now();
            } else if (interactionType === 'blur' || interactionType === 'submit') {
                if (this.formInteractionTimes[fieldKey]) {
                    timeToInteract = Date.now() - this.formInteractionTimes[fieldKey];
                    if (interactionType === 'blur') {
                        delete this.formInteractionTimes[fieldKey];
                    }
                }
            }
            
            const formData = {
                sessionId: this.sessionId,
                pageViewId: this.pageViewId,
                formId: actualForm ? actualForm.id : '',
                formName: actualForm ? actualForm.getAttribute('name') || '' : '',
                fieldName: interactionType === 'submit' ? '' : (target.name || ''),
                fieldType: interactionType === 'submit' ? '' : (target.type || ''),
                interactionType: interactionType,
                timeToInteract: timeToInteract,
                timestamp: Date.now()
            };
            
            this.sendData('form', formData);
        },
        
        storeHeatmapData: function(event) {
            const pageWidth = document.documentElement.scrollWidth;
            const pageHeight = document.documentElement.scrollHeight;
            
            const currentPath = this.getPagePath();
            
            const heatmapData = {
                sessionId: this.sessionId,
                pagePath: currentPath,
                xPercentage: (event.pageX / pageWidth * 100).toFixed(2),
                yPercentage: (event.pageY / pageHeight * 100).toFixed(2),
                elementSelector: this.getElementSelector(event.target),
                timestamp: Date.now()
            };
            
            this.sendData('heatmap', heatmapData);
        },
        
        getElementSelector: function(element) {
            if (!element) return '';
            if (element.id) return '#' + element.id;
            
            let selector = element.tagName.toLowerCase();
            if (element.className && typeof element.className === 'string') {
                selector += '.' + element.className.split(' ').join('.');
            }
            
            return selector;
        },
        
        getScrollPercentage: function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (scrollHeight <= 0) return 0;
            return Math.min(100, Math.round((scrollTop / scrollHeight) * 100));
        },
        
        sendData: function(eventType, data, callback, sync = false) {
            const payload = {
                eventType: eventType,
                data: data,
                timestamp: Date.now()
            };
            
            if (sync && navigator.sendBeacon) {
                navigator.sendBeacon(config.apiEndpoint, JSON.stringify(payload));
                if (callback) callback({ success: true });
            } else {
                fetch(config.apiEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                })
                .then(response => response.json())
                .then(data => {
                    if (callback) callback(data);
                })
                .catch(error => {
                    console.error('WebTracker error:', error);
                    if (callback) callback({ error: error.message });
                });
            }
        },
        
        // public methods
        trackEvent: function(category, action, label, value) {
            const eventData = {
                sessionId: this.sessionId,
                pageViewId: this.pageViewId,
                eventCategory: category,
                eventAction: action,
                eventLabel: label || '',
                eventValue: value || 0,
                timestamp: Date.now()
            };
            
            this.sendData('custom', eventData);
            console.log('🎯 Custom event:', category, action, label);
        },
        
        setUser: function(userId) {
            this.userId = userId;
            this.setStorage('user', userId, 365 * 10);
            console.log(' User ID manually set:', userId);
        },
        
        identify: function(userData) {
            this.sendData('identify', {
                sessionId: this.sessionId,
                userId: this.userId,
                ...userData
            });
            console.log(' User identified:', userData);
        },
        
        debug: function() {
            console.log('=== WEBTRACKER DEBUG ===');
            console.log('User ID:', this.userId);
            console.log('Session ID:', this.sessionId);
            console.log('Page View ID:', this.pageViewId);
            console.log('Current Page Path:', this.getPagePath());
            console.log('Current Page Start:', this.currentPageStartTime);
            console.log('Time on current page:', this.currentPageStartTime ? Math.round((Date.now() - this.currentPageStartTime) / 1000) + 's' : 'N/A');
            console.log('Last Tracked Path:', this.lastTrackedPath);
            console.log('SPA Mode:', config.isSPA);
            console.log('Cookies:', document.cookie);
            console.log('LocalStorage Keys:', Object.keys(localStorage).filter(k => k.startsWith('wt_')));
            console.log('========================');
            
            return {
                userId: this.userId,
                sessionId: this.sessionId,
                pageViewId: this.pageViewId,
                currentPagePath: this.getPagePath(),
                timeOnPage: this.currentPageStartTime ? Math.round((Date.now() - this.currentPageStartTime) / 1000) : 0,
                lastTrackedPath: this.lastTrackedPath,
                isSPA: config.isSPA,
                storage: {
                    cookies: document.cookie,
                    localStorage: Object.keys(localStorage).filter(k => k.startsWith('wt_'))
                }
            };
        }
    };
    
    // auto init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.WebTracker = WebTracker;
        });
    } else {
        window.WebTracker = WebTracker;
    }
    
    window.WebTracker = WebTracker;
    
})(window, document);