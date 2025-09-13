import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Calendar, Users, Eye, MousePointer, Clock, TrendingUp, Monitor, Smartphone, Tablet, Globe, AlertCircle, Activity, X, Camera, RefreshCw } from 'lucide-react';
import SessionRecordings from './components/SessionRecording.js';
import ScreenshotHeatmap from './components/ScreenshotHeatmap.js';
import ScrollHeatmap from './components/ScrollHeatmap.js';
import BehaviorAnalysis from './components/BehaviorAnalysis.js';
import TrafficAnalysis from './components/TrafficAnalysis.js';
import FormAnalytics from './components/FormAnalytics.js';

const API_URL = 'http://localhost:3001/api/analytics';

const Dashboard = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  
  const [overview, setOverview] = useState(null);
  const [pageViews, setPageViews] = useState([]);
  const [sources, setSources] = useState([]);
  const [devices, setDevices] = useState([]);
  const [realtime, setRealtime] = useState(null);
  const [selectedView, setSelectedView] = useState('overview');
  const [loading, setLoading] = useState(true);
  const heatmapRef = useRef(null);
  
  const [topPages, setTopPages] = useState([]);
  const [scrollDepthData, setScrollDepthData] = useState([]);
  
  // screenshot heatmap stuff
  const [showScreenshotHeatmap, setShowScreenshotHeatmap] = useState(false);
  const [showScrollHeatmap, setShowScrollHeatmap] = useState(false);
  const [selectedPagePath, setSelectedPagePath] = useState('/');
  const [selectedPageUrl, setSelectedPageUrl] = useState('');

  // fetch all the data
  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(dateRange);
      
      const overviewRes = await fetch(`${API_URL}/overview?${params}`);
      const overviewData = await overviewRes.json();
      console.log('Overview data:', overviewData);
      setOverview(overviewData);
      
      const pageViewsRes = await fetch(`${API_URL}/pageviews?${params}`);
      const pageViewsData = await pageViewsRes.json();
      console.log('Page views data:', pageViewsData);
      setPageViews(pageViewsData);
      
      const sourcesRes = await fetch(`${API_URL}/sources?${params}`);
      const sourcesData = await sourcesRes.json();
      console.log('Sources data:', sourcesData);
      setSources(sourcesData);
      
      const devicesRes = await fetch(`${API_URL}/devices?${params}`);
      const devicesData = await devicesRes.json();
      console.log('Devices data:', devicesData);
      setDevices(devicesData);
      
      const realtimeRes = await fetch(`${API_URL}/realtime`);
      const realtimeData = await realtimeRes.json();
      console.log('Realtime data:', realtimeData);
      setRealtime(realtimeData);
      
      // get top pages
      try {
        const topPagesRes = await fetch(`${API_URL}/top-pages?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}&limit=5`);
        const topPagesData = await topPagesRes.json();
        setTopPages(Array.isArray(topPagesData) ? topPagesData : []);
      } catch (error) {
        console.error('Error fetching top pages:', error);
        setTopPages([]);
      }
      
      // get scroll depth for uniqe users
      try {
        const scrollDepthRes = await fetch(`${API_URL}/scroll-depth-users?${params}`);
        const scrollDepthDataRes = await scrollDepthRes.json();
        setScrollDepthData(Array.isArray(scrollDepthDataRes) ? scrollDepthDataRes : []);
      } catch (error) {
        console.error('Error fetching scroll depth:', error);
        setScrollDepthData([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetch(`${API_URL}/realtime`)
        .then(res => res.json())
        .then(data => setRealtime(data));
    }, 5000);

    // init heatmap
    if (window.h337 && heatmapRef.current) {
      initializeHeatmap();
    } else {
      const checkHeatmap = setInterval(() => {
        if (window.h337 && heatmapRef.current) {
          initializeHeatmap();
          clearInterval(checkHeatmap);
        }
      }, 1000);
      
      return () => {
        clearInterval(interval);
        clearInterval(checkHeatmap);
      };
    }

    return () => clearInterval(interval);
  }, [dateRange]);

  const initializeHeatmap = async () => {
    if (!window.h337 || !heatmapRef.current) {
      console.log('Heatmap.js not loaded or container not ready');
      return;
    }

    // clear existing
    heatmapRef.current.innerHTML = '';

    const heatmapInstance = window.h337.create({
      container: heatmapRef.current,
      radius: 30,
      maxOpacity: 0.6,
      minOpacity: 0,
      blur: 0.75,
      gradient: {
        '.5': 'blue',
        '.8': 'yellow',
        '.95': 'red'
      }
    });

    try {
      const params = new URLSearchParams(dateRange);
      const response = await fetch(`${API_URL}/clicks?pagePath=/home&${params}`);
      const clickData = await response.json();
      
      if (clickData && clickData.length > 0) {
        const points = clickData.map(click => ({
          x: Math.round((click.x_percentage / 100) * heatmapRef.current.offsetWidth),
          y: Math.round((click.y_percentage / 100) * heatmapRef.current.offsetHeight),
          value: click.click_count || 1
        }));

        heatmapInstance.setData({
          max: Math.max(...points.map(p => p.value)),
          data: points
        });
        
        console.log(`Heatmap rendered with ${points.length} points`);
      } else {
        // show sample data
        const samplePoints = [
          { x: 100, y: 100, value: 5 },
          { x: 200, y: 150, value: 10 },
          { x: 300, y: 200, value: 7 },
          { x: 150, y: 250, value: 3 }
        ];
        
        heatmapInstance.setData({
          max: 10,
          data: samplePoints
        });
        
        console.log('Showing sample heatmap data');
      }
    } catch (error) {
      console.error('Error loading heatmap:', error);
      
      // fallback sample data
      const samplePoints = [
        { x: 100, y: 100, value: 5 },
        { x: 200, y: 150, value: 10 },
        { x: 300, y: 200, value: 7 }
      ];
      
      heatmapInstance.setData({
        max: 10,
        data: samplePoints
      });
    }
  };

  const openScreenshotHeatmap = (pagePath, pageUrl = '') => {
    setSelectedPagePath(pagePath);
    setSelectedPageUrl(pageUrl || 'http://127.0.0.1:5500/test.html');
    setShowScreenshotHeatmap(true);
  };

  const openScrollHeatmap = (pagePath, pageUrl = '') => {
    setSelectedPagePath(pagePath);
    setSelectedPageUrl(pageUrl || 'http://127.0.0.1:5500/test.html');
    setShowScrollHeatmap(true);
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num?.toString() || '0';
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0s';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Activity className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Web Analytics Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                  className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                  className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex items-center space-x-2 px-4 py-2 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">
                  {realtime?.active_users || 0} Active Now
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-1 border-t">
            {['overview', 'traffic', 'behavior', 'forms', 'sessions'].map((view) => (
              <button
                key={view}
                onClick={() => setSelectedView(view)}
                className={`px-4 py-3 text-sm font-medium capitalize transition-colors ${
                  selectedView === view
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {view}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* overview tab */}
        {selectedView === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-8 h-8 text-blue-500" />
                  <span className="text-xs text-green-600 font-medium">+12%</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {formatNumber(overview?.unique_visitors)}
                </h3>
                <p className="text-sm text-gray-600 mt-1">Unique Visitors</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-2">
                  <Eye className="w-8 h-8 text-green-500" />
                  <span className="text-xs text-green-600 font-medium">+8%</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {formatNumber(overview?.total_page_views)}
                </h3>
                <p className="text-sm text-gray-600 mt-1">Page Views</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="w-8 h-8 text-purple-500" />
                  <span className="text-xs text-red-600 font-medium">-3%</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {formatDuration(overview?.avg_time_on_page)}
                </h3>
                <p className="text-sm text-gray-600 mt-1">Avg. Time on Page</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-8 h-8 text-orange-500" />
                  <span className="text-xs text-red-600 font-medium">-5%</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                   {(overview?.bounce_rate ?? 0).toFixed(1)}%
                </h3>
                <p className="text-sm text-gray-600 mt-1">Bounce Rate</p>
              </div>
            </div>

            {/* page views chart */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Traffic Overview</h2>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={pageViews}>
                  <defs>
                    <linearGradient id="colorPageviews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="date" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="pageviews" 
                    stroke="#3B82F6" 
                    fillOpacity={1} 
                    fill="url(#colorPageviews)"
                    strokeWidth={2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="sessions" 
                    stroke="#10B981" 
                    fillOpacity={1} 
                    fill="url(#colorSessions)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* click heatmap */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <MousePointer className="w-5 h-5 text-orange-500" />
                  Click Heatmap (Last 7 Days)
                </h2>
                <button 
                  onClick={() => openScreenshotHeatmap('/home', 'http://127.0.0.1:5500/test.html#home')}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  View Screenshot Heatmap
                </button>
              </div>
              <div 
                ref={heatmapRef}
                className="relative bg-gray-50 rounded-lg overflow-hidden cursor-pointer"
                style={{ height: '400px' }}
                onClick={() => openScreenshotHeatmap('/home', 'http://127.0.0.1:5500/test.html#home')}
              >
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <MousePointer className="w-12 h-12 mx-auto mb-2" />
                    <p>Loading click heatmap...</p>
                    <p className="text-sm mt-2">Click to view screenshot heatmap</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{background: 'blue'}}></div>
                  Low
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{background: 'yellow'}}></div>
                  Medium
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{background: 'red'}}></div>
                  High
                </span>
              </div>
            </div>

            {/* scroll heatmap */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Scroll Depth Heatmap (Last 7 Days)
                </h2>
                <button 
                  onClick={() => openScrollHeatmap('/', 'http://127.0.0.1:5500/test.html')}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  View Scroll Heatmap
                </button>
              </div>
              <div 
                className="relative bg-gradient-to-b from-red-100 via-yellow-100 via-green-100 to-blue-100 rounded-lg overflow-hidden cursor-pointer"
                style={{ height: '400px' }}
                onClick={() => openScrollHeatmap('/', 'http://127.0.0.1:5500/test.html')}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center bg-white bg-opacity-90 rounded-lg p-6">
                    <TrendingUp className="w-12 h-12 text-green-500 mx-auto mb-2" />
                    <p className="text-gray-700 font-medium">Scroll Depth Visualization</p>
                    <p className="text-sm text-gray-500 mt-2">Click to view detailed scroll heatmap</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* traffic tab */}
        {selectedView === 'traffic' && (
          <TrafficAnalysis 
            sources={sources}
            devices={devices}
            formatNumber={formatNumber}
            COLORS={COLORS}
          />
        )}

        {/* behavoir tab */}
        {selectedView === 'behavior' && (
          <BehaviorAnalysis 
            topPages={topPages}
            scrollDepthData={scrollDepthData}
            formatNumber={formatNumber}
          />
        )}
        
        {/* forms tab */}
        {selectedView === 'forms' && (
          <FormAnalytics 
            dateRange={dateRange}
            formatNumber={formatNumber}
            COLORS={COLORS}
          />
        )}

        {/* sessions tab */}
        {selectedView === 'sessions' && (
          <SessionRecordings />
        )}
      </div>

      {/* screenshot heatmap modal */}
      {showScreenshotHeatmap && (
        <ScreenshotHeatmap
          pagePath={selectedPagePath}
          pageUrl={selectedPageUrl}
          onClose={() => setShowScreenshotHeatmap(false)}
        />
      )}

      {/* scroll heatmap modal */}
      {showScrollHeatmap && (
        <ScrollHeatmap
          pagePath={selectedPagePath}
          pageUrl={selectedPageUrl}
          onClose={() => setShowScrollHeatmap(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;