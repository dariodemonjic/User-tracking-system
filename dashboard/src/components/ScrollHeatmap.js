import React, { useState, useEffect } from 'react';
import { Camera, RefreshCw, X, TrendingUp, Monitor, Globe } from 'lucide-react';

const API_URL = 'http://localhost:3001/api/analytics';

const ScrollHeatmap = ({ pagePath: initialPagePath, pageUrl: initialPageUrl, onClose }) => {
  const [scrollData, setScrollData] = useState([]);
  const [screenshot, setScreenshot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [screenshotLoading, setScreenshotLoading] = useState(false);
  const [selectedPage, setSelectedPage] = useState('');
  const [selectedUrl, setSelectedUrl] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  // Predefined page configurations
  const pageConfigs = [
    {
      path: '/home',
      name: 'Home Page',
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
    return new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  };

  const getEndDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const takeScreenshot = async (showLoading = true) => {
    const urlToScreenshot = showUrlInput ? customUrl : selectedUrl;
    
    if (!urlToScreenshot) {
      console.log('Please provide a URL to screenshot');
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
    console.log('=== LOADING SCROLL DATA ===');
    console.log('Loading scroll data for page:', pageToLoad);
    
    setLoading(true);
    
    try {
      // Load scroll depth data for the selected page
      const scrollUrl = `${API_URL}/scroll-depth?pagePath=${encodeURIComponent(pageToLoad)}&startDate=${getStartDate()}&endDate=${getEndDate()}`;
      console.log('Fetching scroll data from:', scrollUrl);
      
      const scrollResponse = await fetch(scrollUrl);
      const scrollResult = await scrollResponse.json();
      
      console.log(`Loaded scroll data for ${pageToLoad}:`, scrollResult);
      setScrollData(scrollResult);

      // Load screenshot info for the selected page
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

      // Auto-take screenshoot if none existss and we have a URL
      const currentUrl = pageConfigs.find(p => p.path === pageToLoad)?.url || selectedUrl || customUrl;
      if (!screenshotExists && currentUrl) {
        console.log(`Auto-taking screenshot for ${pageToLoad} with URL: ${currentUrl}`);
        await takeScreenshot(false);
      } else if (!currentUrl) {
        console.log('No URL available for screenshot');
      }

    } catch (error) {
      console.error('Error loading scroll data:', error);
    }
    
    setLoading(false);
  };

  const handlePageChange = (newPagePath) => {
    console.log('=== PAGE CHANGE ===');
    console.log('Changing from:', selectedPage, 'to:', newPagePath);
    
    if (newPagePath === 'custom') {
      setShowUrlInput(true);
      return; // Dont load data yet, wait for custom URL
    }
    
    if (newPagePath === '') {
      return; // Dont load if no page selected
    }
    
    const pageConfig = pageConfigs.find(p => p.path === newPagePath);
    
    // Update state first
    setSelectedPage(newPagePath);
    setShowUrlInput(false);
    
    if (pageConfig) {
      console.log('Found page config:', pageConfig);
      setSelectedUrl(pageConfig.url);
    } else {
      console.log('No config found for:', newPagePath);
      return;
    }
    
    // Clear current data immediately
    console.log('Clearing current data...');
    setScrollData([]);
    setScreenshot(null);
    setLoading(true);
    
    // Load new data after a short delay to ensure state is updated
    setTimeout(() => {
      console.log('Loading scroll data for:', newPagePath);
      loadData(newPagePath);
    }, 100);
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
      setScrollData([]);
      setScreenshot(null);
      loadData(customPath);
    }
  };

  useEffect(() => {
    // Initialize with the provided page or default to /home
    let initialPage = initialPagePath;
    
    // Map common paths to our standardized paths
    if (initialPagePath === '/' || !initialPagePath) {
      initialPage = '/home';
    }
    
    console.log('Initializing ScrollHeatmap with:', { initialPagePath, initialPage, initialPageUrl });
    
    // Find the page config for the initial page
    const pageConfig = pageConfigs.find(p => p.path === initialPage);
    
    if (pageConfig) {
      console.log('Found page config:', pageConfig);
      setSelectedPage(initialPage);
      setSelectedUrl(pageConfig.url);
      setShowUrlInput(false);
      loadData(initialPage);
    } else {
      // If no matching config, use /home as fallback
      console.log('No config found for', initialPage, 'using /home as fallback');
      setSelectedPage('/home');
      setSelectedUrl('http://127.0.0.1:5500/test.html#home');
      setShowUrlInput(false);
      loadData('/home');
    }
  }, []);

  const getCurrentPageConfig = () => {
    return pageConfigs.find(p => p.path === selectedPage);
  };

  // Calculate color based on scroll percentage
  const getScrollHeatmapColor = (percentage) => {
    if (percentage >= 90) return 'rgba(255, 0, 0, 0.7)';     // Red - hot
    if (percentage >= 70) return 'rgba(255, 165, 0, 0.6)';   // Orange
    if (percentage >= 50) return 'rgba(255, 255, 0, 0.5)';   // Yellow
    if (percentage >= 30) return 'rgba(0, 255, 0, 0.4)';     // Green
    return 'rgba(0, 100, 255, 0.3)';                          // Blue - cold
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-7xl h-5/6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-green-500" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Scroll Heatmap</h2>
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
            {/* Page Selector */}
            <div className="flex items-center gap-2">
              <select
                value={selectedPage}
                onChange={(e) => handlePageChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-sm"
              >
                <option value="">Select a page...</option>
                {pageConfigs.map((page) => (
                  <option key={page.path} value={page.path}>
                    {page.name} ({page.path})
                  </option>
                ))}
                <option value="custom">Custom URL...</option>
              </select>
            </div>

            {/* Custom URL Input */}
            {showUrlInput && (
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="Enter custom URL..."
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm w-64"
                />
                <button
                  onClick={handleCustomPageSubmit}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  Load
                </button>
              </div>
            )}
            
            <button
              onClick={() => takeScreenshot(true)}
              disabled={screenshotLoading}
              className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
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

        {/* Content */}
        <div className="flex-1 overflow-auto bg-gray-100">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading scroll data for {selectedPage}...</p>
              </div>
            </div>
          ) : !screenshot ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Screenshot Available</h3>
                <p className="text-gray-600 mb-4">Take a screenshot to view the scroll heatmap for {selectedPage}</p>
                <button
                  onClick={() => takeScreenshot(true)}
                  disabled={screenshotLoading || (!selectedUrl && !customUrl)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors mx-auto"
                >
                  <Camera className="w-4 h-4" />
                  Take Screenshot
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-4 p-4 h-full">
              {/* Main screenshot area - scrollable vertically only */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50 rounded-lg p-4">
                <div className="relative w-full" style={{ lineHeight: 0 }}>
                  <img
                    src={screenshot.url}
                    alt={`Screenshot of ${selectedPage}`}
                    className="block w-full h-auto shadow-lg rounded-lg"
                    style={{
                      position: 'relative',
                      zIndex: 0,
                    }}
                  />
                  
                  {/* Scroll heatmap overlay */}
                  <div className="absolute inset-0 pointer-events-none rounded-lg overflow-hidden">
                    {scrollData && scrollData.map((data, index) => {
                      const height = 10; // Each section is 10% of the page
                      const topPosition = data.depth;
                      const color = getScrollHeatmapColor(data.percentage);
                      
                      return (
                        <div
                          key={index}
                          className="absolute left-0 right-0"
                          style={{
                            top: `${topPosition}%`,
                            height: `${height}%`,
                            background: `linear-gradient(to bottom, ${color}, ${color.replace(/[\d.]+\)$/, '0.1)')})`,
                            transition: 'opacity 0.3s'
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Stats panel - now outside the screenshot */}
              <div className="w-64 flex-shrink-0 flex flex-col gap-4 overflow-y-auto">
                {/* Page Info Card */}
                <div className="bg-white rounded-lg p-4 shadow-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Globe className="w-5 h-5 text-blue-500" />
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

                {/* Scroll Depth Stats Card */}
                <div className="bg-white rounded-lg p-4 shadow-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <h3 className="font-semibold text-gray-900">Scroll Depth Stats</h3>
                  </div>
                  
                  <div className="space-y-2">
                    {scrollData && scrollData.map((data, index) => {
                      if (index % 2 === 0) { // Show every other depth level
                        return (
                          <div key={data.depth} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">{data.depth}% depth</span>
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="h-2 rounded-full transition-all duration-300"
                                  style={{
                                    width: `${data.percentage}%`,
                                    backgroundColor: getScrollHeatmapColor(data.percentage).replace(/[\d.]+\)$/, '1)')
                                  }}
                                />
                              </div>
                              <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                                {Math.round(data.percentage)}%
                              </span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>

                {/* Engagement Summary */}
                <div className="bg-white rounded-lg p-4 shadow-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">Engagement Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Above Fold (0-25%)</span>
                      <span className="text-sm font-bold text-green-600">
                        {scrollData && scrollData.find(d => d.depth === 0) ? scrollData.find(d => d.depth === 0).percentage.toFixed(0) : '0'}% users
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Mid Page (50%)</span>
                      <span className="text-sm font-bold text-yellow-600">
                        {scrollData && scrollData.find(d => d.depth === 50) ? scrollData.find(d => d.depth === 50).percentage.toFixed(0) : '0'}% users
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Bottom (100%)</span>
                      <span className="text-sm font-bold text-red-600">
                        {scrollData && scrollData.find(d => d.depth === 100) ? scrollData.find(d => d.depth === 100).percentage.toFixed(0) : '0'}% users
                      </span>
                    </div>
                  </div>
                </div>

                {/* Info Card */}
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="text-sm text-green-800">
                    <p className="font-medium mb-2">How to Use</p>
                    <p className="text-xs leading-relaxed">
                      1. Select a page from the dropdown<br/>
                      2. Take a screenshot if needed<br/>
                      3. View scroll heatmap overlay<br/>
                      4. Red = most viewed areas
                    </p>
                  </div>
                </div>

                {/* Legend */}
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-xs font-medium text-gray-700 mb-2">Color Legend</p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 rounded" style={{background: 'rgba(255, 0, 0, 0.7)'}}></div>
                      <span className="text-gray-600">Hot (90%+ users)</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 rounded" style={{background: 'rgba(255, 165, 0, 0.6)'}}></div>
                      <span className="text-gray-600">Warm (70%+ users)</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 rounded" style={{background: 'rgba(0, 100, 255, 0.3)'}}></div>
                      <span className="text-gray-600">Cold (&lt; 30% users)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              {screenshot 
                ? `Screenshot: ${screenshot.originalUrl}`
                : 'No screenshot available'
              }
            </span>
            <span>Page: {selectedPage} | Scroll data from last 7 days</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollHeatmap;