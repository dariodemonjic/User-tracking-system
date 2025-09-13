import React, { useState, useEffect, useRef } from 'react';
import { Camera, RefreshCw, X, Eye, MousePointer, Globe, ChevronDown } from 'lucide-react';

const API_URL = 'http://localhost:3001/api/analytics';

const ScreenshotHeatmap = ({ pagePath: initialPagePath, pageUrl: initialPageUrl, onClose }) => {
  const [heatmapData, setHeatmapData] = useState([]);
  const [screenshot, setScreenshot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [screenshotLoading, setScreenshotLoading] = useState(false);
  const [selectedPage, setSelectedPage] = useState('/home');
  const [selectedUrl, setSelectedUrl] = useState('http://127.0.0.1:5500/test.html#home');
  const [customUrl, setCustomUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const imageRef = useRef(null);
  const overlayRef = useRef(null);

  // pages we're tracking
  const pageConfigs = [
   
    {
      path: '/home',
      name: 'Home (Hash)',
      url: 'http://127.0.0.1:5500/test.html#home',
      hash: '#home'
    },
    {
      path: '/products',
      name: 'Products Page',
      url: 'http://127.0.0.1:5500/test.html#products',
      hash: '#products'
    },
    {
      path: '/about',
      name: 'About Page',
      url: 'http://127.0.0.1:5500/test.html#about',
      hash: '#about'
    },
    {
      path: '/contact',
      name: 'Contact Page',
      url: 'http://127.0.0.1:5500/test.html#contact',
      hash: '#contact'
    },
    {
      path: '/account',
      name: 'Account Page',
      url: 'http://127.0.0.1:5500/test.html#account',
      hash: '#account'
    },
    {
      path: '/cart',
      name: 'Cart Page',
      url: 'http://127.0.0.1:5500/test.html#cart',
      hash: '#cart'
    }
  ];

  const getStartDate = () => {
    // last week
    return new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  };

  const getEndDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const renderHeatmapOverlay = () => {
    if (!overlayRef.current || !imageRef.current || heatmapData.length === 0) return;

    const overlay = overlayRef.current;
    const image = imageRef.current;

    // clean up old stuff
    overlay.innerHTML = '';

    if (!window.h337) {
      console.error('heatmap.js not loaded');
      return;
    }

    const imageWidth = image.offsetWidth;
    const imageHeight = image.offsetHeight;

    // make the heatmap
    const heatmapInstance = window.h337.create({
      container: overlay,
      radius: 30,
      maxOpacity: 0.8,
      minOpacity: 0,
      blur: 0.75,
      gradient: {
        0.4: 'blue',
        0.6: 'cyan',
        0.7: 'lime',
        0.8: 'yellow',
        1.0: 'red',
      },
    });

    const heatmapPoints = heatmapData.map((point) => ({
      x: Math.round((parseFloat(point.x_percentage) / 100) * imageWidth),
      y: Math.round((parseFloat(point.y_percentage) / 100) * imageHeight),
      value: parseInt(point.click_count) || 1,
    }));

    heatmapInstance.setData({
      max: Math.max(...heatmapPoints.map((p) => p.value)),
      data: heatmapPoints,
    });

    // fix canvas z-index issues.. always fun
    const boostCanvasZ = () => {
      if (!overlay) return;
      overlay.style.position = 'absolute';
      overlay.style.pointerEvents = 'none';
      overlay.style.zIndex = '2147483647';  // max z-index lol
      overlay.style.inset = '0';

      const canvases = overlay.querySelectorAll('canvas');
      canvases.forEach((c) => {
        c.style.position = 'absolute';
        c.style.inset = '0';
        c.style.width = '100%';
        c.style.height = '100%';
        c.style.zIndex = '2147483647';
        c.style.pointerEvents = 'none';
      });
    };

    boostCanvasZ();
    requestAnimationFrame(boostCanvasZ);  // double tap for good measure

    console.log(`Rendered heatmap with ${heatmapPoints.length} points for ${selectedPage}`);
  };

  const handleImageLoad = () => {
    // wait a bit for dom to settle
    setTimeout(() => {
      renderHeatmapOverlay();
    }, 100);
  };

  const takeScreenshot = async (showLoading = true) => {
    const urlToScreenshot = showUrlInput ? customUrl : selectedUrl;
    
    if (!urlToScreenshot) {
      alert('Please provide a URL to screenshot');
      return;
    }

    if (showLoading) {
      setScreenshotLoading(true);
    }
    
    try {
      const response = await fetch('http://localhost:3001/api/screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: urlToScreenshot,
          pagePath: selectedPage
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setScreenshot({
          url: `http://localhost:3001${result.path}`,
          date: new Date().toISOString(),
          originalUrl: urlToScreenshot
        });
        
        // wait for img to load then redraw
        setTimeout(() => {
          renderHeatmapOverlay();
        }, 1000);
        
        return true;
      } else {
        if (showLoading) {
          alert('Failed to take screenshot: ' + result.error);
        }
        return false;
      }
    } catch (error) {
      console.error('Screenshot error:', error);
      if (showLoading) {
        alert('Failed to take screenshot');
      }
      return false;
    } finally {
      if (showLoading) {
        setScreenshotLoading(false);
      }
    }
  };

  const loadData = async (pageToLoad = selectedPage) => {
    console.log('=== LOADING DATA ===');
    console.log('Loading data for page:', pageToLoad);
    console.log('Current selectedPage state:', selectedPage);
    console.log('Current selectedUrl state:', selectedUrl);
    
    setLoading(true);
    
    try {
      // get clicks data
      const heatmapUrl = `${API_URL}/clicks?pagePath=${encodeURIComponent(pageToLoad)}&startDate=${getStartDate()}&endDate=${getEndDate()}`;
      console.log('Fetching heatmap from:', heatmapUrl);
      
      const heatmapResponse = await fetch(heatmapUrl);
      const heatmapResult = await heatmapResponse.json();
      
      console.log(`Loaded ${heatmapResult.length} heatmap points for ${pageToLoad}`);
      setHeatmapData(heatmapResult);

      // check if we already have a screesnhot
      let screenshotExists = false;
      try {
        const screenshotUrl = `http://localhost:3001/api/screenshot-info/${encodeURIComponent(pageToLoad)}`;
        console.log('Checking for screenshot at:', screenshotUrl);
        
        const screenshotResponse = await fetch(screenshotUrl);
        if (screenshotResponse.ok) {
          const screenshotInfo = await screenshotResponse.json();
          console.log('Found existing screenshot:', screenshotInfo);
          setScreenshot({
            url: `http://localhost:3001/api/screenshot/${screenshotInfo.filename}`,
            date: screenshotInfo.screenshot_date,
            originalUrl: screenshotInfo.url
          });
          screenshotExists = true;
        }
      } catch (error) {
        console.log(`No existing screenshot found for ${pageToLoad}:`, error.message);
      }

      // auto screenshot if we dont have one
      const currentUrl = pageConfigs.find(p => p.path === pageToLoad)?.url || selectedUrl || customUrl;
      if (!screenshotExists && currentUrl) {
        console.log(`Auto-taking screenshot for ${pageToLoad} with URL: ${currentUrl}`);
        await takeScreenshot(false);
      } else if (!currentUrl) {
        console.log('No URL available for screenshot');
      }

    } catch (error) {
      console.error('Error loading data:', error);
    }
    
    setLoading(false);
  };

  const handlePageChange = (newPagePath) => {
    const pageConfig = pageConfigs.find(p => p.path === newPagePath);
    setSelectedPage(newPagePath);
    
    if (pageConfig) {
      setSelectedUrl(pageConfig.url);
      setShowUrlInput(false);
    } else {
      setShowUrlInput(true);
    }
    
    // reset everything
    setHeatmapData([]);
    setScreenshot(null);
    
    // load fresh
    loadData(newPagePath);
  };

  const handleCustomPageSubmit = () => {
    if (!customUrl.trim()) {
      alert('Please enter a valid URL');
      return;
    }
    
    const customPath = prompt('Enter page path for this URL (e.g., /custom-page):');
    if (customPath) {
      setSelectedPage(customPath);
      setSelectedUrl(customUrl);
      setHeatmapData([]);
      setScreenshot(null);
      loadData(customPath);
    }
  };

  useEffect(() => {
    // setup initial page
    let initialPage = initialPagePath;
    
    // handle root path
    if (initialPagePath === '/' || !initialPagePath) {
      initialPage = '/home';
    }
    
    console.log('Initializing ScreenshotHeatmap with:', { initialPagePath, initialPage, initialPageUrl });
    
    // find matching config
    const pageConfig = pageConfigs.find(p => p.path === initialPage);
    
    if (pageConfig) {
      console.log('Found page config:', pageConfig);
      setSelectedPage(initialPage);
      setSelectedUrl(pageConfig.url);
      setShowUrlInput(false);
      loadData(initialPage);
    } else {
      // no config, use custom
      console.log('No config found for', initialPage, 'using custom URL');
      setSelectedPage(initialPage);
      setSelectedUrl(initialPageUrl || 'http://127.0.0.1:5500/test.html#home');
      setShowUrlInput(false);
      loadData(initialPage);
    }
  }, []);

  // redraw on resize
  useEffect(() => {
    const handleResize = () => {
      if (screenshot && heatmapData.length > 0) {
        renderHeatmapOverlay();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [screenshot, heatmapData]);

  const getCurrentPageConfig = () => {
    return pageConfigs.find(p => p.path === selectedPage);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-7xl h-5/6 flex flex-col">
        {/* top bar */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div className="flex items-center gap-3">
            <Camera className="w-6 h-6 text-blue-500" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Screenshot Heatmap</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{selectedPage}</span>
                {getCurrentPageConfig() && (
                  <span className="text-xs text-gray-500">({getCurrentPageConfig().name})</span>
                )}
              </div>
              {screenshot && (
                <p className="text-xs text-gray-500">
                  Screenshot from: {new Date(screenshot.date).toLocaleString()}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* page dropdown */}
            <div className="flex items-center gap-2">
              <select
                value={selectedPage}
                onChange={(e) => handlePageChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
              >
                {pageConfigs.map((page) => (
                  <option key={page.path} value={page.path}>
                    {page.name} ({page.path})
                  </option>
                ))}
                <option value="custom">Custom URL...</option>
              </select>
            </div>

            {/* custm url input */}
            {showUrlInput && (
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="Enter custom URL..."
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-64"
                />
                <button
                  onClick={handleCustomPageSubmit}
                  className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                >
                  Load
                </button>
              </div>
            )}

            {/* legend */}
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                Low
              </span>
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                Medium
              </span>
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-red-500"></div>
                High
              </span>
            </div>
            
            <button
              onClick={() => takeScreenshot(true)}
              disabled={screenshotLoading}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {screenshotLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Camera className="w-4 h-4" />
              )}
              {screenshotLoading ? 'Taking Screenshot...' : screenshot ? 'Update Screenshot' : 'Take Screenshot'}
            </button>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* main content area */}
        <div className="flex-1 overflow-auto bg-gray-100">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading heatmap data for {selectedPage}...</p>
                {!screenshot && selectedUrl && (
                  <p className="text-sm text-gray-500 mt-2">Taking screenshot automatically...</p>
                )}
              </div>
            </div>
          ) : !screenshot ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Screenshot Available</h3>
                <p className="text-gray-600 mb-4">Take a screenshot to view the heatmap overlay for {selectedPage}</p>
                <button
                  onClick={() => takeScreenshot(true)}
                  disabled={screenshotLoading || (!selectedUrl && !customUrl)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors mx-auto"
                >
                  <Camera className="w-4 h-4" />
                  Take Screenshot
                </button>
                {!selectedUrl && !customUrl && (
                  <p className="text-sm text-red-600 mt-2">Please select a page or provide a custom URL</p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex gap-4 p-4 h-full">
              {/* screenshot with heatmap */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50 rounded-lg p-4">
                <div className="relative w-full isolate" style={{ lineHeight: 0 }}>
                  <img
                    ref={imageRef}
                    src={screenshot.url}
                    alt={`Screenshot of ${selectedPage}`}
                    onLoad={handleImageLoad}
                    className="block w-full h-auto shadow-lg rounded-lg"
                    style={{
                      position: 'relative',
                      zIndex: 0,
                    }}
                  />

                  <div
                    ref={overlayRef}
                    className="absolute inset-0 rounded-lg"
                    style={{
                      zIndex: 2147483647,  // max it out
                      pointerEvents: 'none',
                    }}
                  />

                  {heatmapData.length === 0 && (
                    <div 
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg"
                      style={{ zIndex: 5 }}
                    >
                      <div className="bg-white rounded-lg p-6 text-center">
                        <MousePointer className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Click Data</h3>
                        <p className="text-gray-600">No clicks recorded for {selectedPage} in the last 7 days.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* sidebar stats */}
              <div className="w-64 flex-shrink-0 flex flex-col gap-4 overflow-y-auto">
                {/* page info */}
                <div className="bg-white rounded-lg p-4 shadow-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Globe className="w-5 h-5 text-green-500" />
                    <h3 className="font-semibold text-gray-900">Page Info</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <div className="text-xs text-gray-500">Page Path</div>
                      <div className="text-sm font-medium text-gray-700 break-all">{selectedPage}</div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-gray-500">Page URL</div>
                      <div className="text-sm font-medium text-gray-700 break-all">
                        {screenshot?.originalUrl || selectedUrl || 'Not set'}
                      </div>
                    </div>
                    
                    {getCurrentPageConfig() && (
                      <div>
                        <div className="text-xs text-gray-500">Page Type</div>
                        <div className="text-sm font-medium text-gray-700">{getCurrentPageConfig().name}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* click stats */}
                <div className="bg-white rounded-lg p-4 shadow-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Eye className="w-5 h-5 text-blue-500" />
                    <h3 className="font-semibold text-gray-900">Click Statistics</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Click Areas</span>
                      <span className="text-lg font-bold text-blue-600">{heatmapData.length}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Clicks</span>
                      <span className="text-lg font-bold text-green-600">
                        {heatmapData.reduce((sum, point) => sum + (parseInt(point.click_count) || 0), 0)}
                      </span>
                    </div>
                    
                    <div className="pt-2 border-t">
                      <div className="text-xs text-gray-500">Data Period</div>
                      <div className="text-sm font-medium text-gray-700">Last 7 days</div>
                    </div>
                  </div>
                </div>

                {/* hotspots */}
                {heatmapData.length > 0 && (
                  <div className="bg-white rounded-lg p-4 shadow-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-3">Top Click Areas</h3>
                    <div className="space-y-2">
                      {heatmapData
                        .sort((a, b) => b.click_count - a.click_count)
                        .slice(0, 5)
                        .map((area, index) => (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">
                              {Math.round(area.x_percentage)}%, {Math.round(area.y_percentage)}%
                            </span>
                            <span className="font-medium text-gray-900">{area.click_count} clicks</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* help text */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-2">How to Use</p>
                    <p className="text-xs leading-relaxed">
                      1. Select a page from the dropdown<br/>
                      2. Take a screenshot if needed<br/>
                      3. View click heatmap overlay<br/>
                      4. Use custom URLs for external pages
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* bottom status bar */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              {screenshot 
                ? `Screenshot: ${screenshot.originalUrl}`
                : 'No screenshot available'
              }
            </span>
            <span>Page: {selectedPage} | Data from last 7 days</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScreenshotHeatmap;