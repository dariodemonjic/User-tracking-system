import React, { useState, useEffect } from 'react';
import { Activity, Eye, MousePointer, TrendingUp, Monitor, Smartphone, Tablet, RefreshCw, X, Clock } from 'lucide-react';

const API_URL = 'http://localhost:3001/api/analytics';

// Event Timeline Component
const EventTimeline = ({ session, onClose }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessionEvents();
  }, [session]);

  const loadSessionEvents = async () => {
    setLoading(true);
    try {
      const eventsResponse = await fetch(`${API_URL}/session-events/${session.session_id}`);
      const eventsData = await eventsResponse.json();
      setEvents(eventsData);
    } catch (error) {
      console.error('Error loading session events:', error);
    }
    setLoading(false);
  };

  const getEventIcon = (type) => {
    switch(type) {
      case 'click': return <MousePointer className="w-4 h-4 text-blue-500" />;
      case 'scroll': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'pageview': return <Eye className="w-4 h-4 text-purple-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatEventDetails = (event) => {
    const details = [];
    
    // For pageview events, show page and title
    if (event.type === 'pageview') {
      if (event.page) {
        details.push(`Page: ${event.page}`);
      }
      if (event.title) {
        details.push(`Title: ${event.title}`);
      }
    }
    
    if (event.element) {
      details.push(`Element: ${event.element}`);
    }
    
    if (event.x_percentage !== null && event.y_percentage !== null) {
      details.push(`Position: ${parseFloat(event.x_percentage).toFixed(1)}%, ${parseFloat(event.y_percentage).toFixed(1)}%`);
    }
    
    if (event.scroll_percentage !== null) {
      details.push(`Scroll: ${event.scroll_percentage}%`);
    }
    
    return details;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-purple-500" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Event Timeline</h2>
              <p className="text-sm text-gray-600">
                Session: {session.user_id?.substring(0, 8)}... | {new Date(session.created_at).toLocaleString()}
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Session Summary */}
        <div className="p-4 bg-gray-50 border-b">
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Duration:</span>
              <span className="ml-2 font-medium">
                {Math.round(session.session_duration / 60)}m {Math.round(session.session_duration % 60)}s
              </span>
            </div>
            <div>
              <span className="text-gray-500">Pages:</span>
              <span className="ml-2 font-medium">{session.page_views || 0}</span>
            </div>
            <div>
              <span className="text-gray-500">Clicks:</span>
              <span className="ml-2 font-medium">{session.clicks || 0}</span>
            </div>
            <div>
              <span className="text-gray-500">Device:</span>
              <span className="ml-2 font-medium">{session.device_type}</span>
            </div>
          </div>
        </div>

        {/* Events List */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No events recorded in this session
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((event, index) => {
                const eventDetails = formatEventDetails(event);
                const eventTime = new Date(event.timestamp);
                const sessionStart = new Date(events[0]?.timestamp || event.timestamp);
                const timeDiff = Math.round((eventTime - sessionStart) / 1000);
                
                return (
                  <div
                    key={index}
                    className="flex gap-4 p-3 rounded-lg bg-white border border-gray-200 hover:border-purple-300 hover:shadow-sm transition-all"
                  >
                    {/* Timeline connector */}
                    <div className="flex flex-col items-center">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
                        {getEventIcon(event.type)}
                      </div>
                      {index < events.length - 1 && (
                        <div className="w-0.5 flex-1 bg-gray-200 mt-2"></div>
                      )}
                    </div>

                    {/* Event content */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900 capitalize">
                            {event.type}
                          </span>
                          <span className="text-xs text-gray-500">
                            +{timeDiff}s
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {eventTime.toLocaleTimeString()}
                        </span>
                      </div>
                      
                      {eventDetails.length > 0 && (
                        <div className="space-y-1">
                          {eventDetails.map((detail, idx) => (
                            <p key={idx} className="text-sm text-gray-600">
                              {detail}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Total Events: {events.length}</span>
            <button
              onClick={loadSessionEvents}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <RefreshCw className="w-4 h-4 inline mr-1" />
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Session Recordings Component
const SessionRecordings = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showTimeline, setShowTimeline] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/sessions-with-activity`);
      const data = await response.json();
      setSessions(data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
    setLoading(false);
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0s';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  };

  const getDeviceIcon = (type) => {
    switch(type?.toLowerCase()) {
      case 'mobile': return <Smartphone className="w-4 h-4" />;
      case 'tablet': return <Tablet className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  const openTimeline = (session) => {
    setSelectedSession(session);
    setShowTimeline(true);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-500" />
            Session Recordings (Last 7 Days)
          </h2>
          <button 
            onClick={fetchSessions}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RefreshCw className="w-4 h-4 inline mr-1" />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No sessions recorded yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Session Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Device
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pages
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timeline
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sessions.map((session) => (
                  <tr key={session.session_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {session.user_id ? session.user_id.substring(0, 8) : 'Anonymous'}...
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(session.created_at).toLocaleString()}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getDeviceIcon(session.device_type)}
                        <div>
                          <p className="text-sm text-gray-900">{session.device_type}</p>
                          <p className="text-xs text-gray-500">{session.browser}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{session.page_views || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <MousePointer className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-gray-900">{session.clicks || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-900">{session.max_scroll || 0}%</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {formatDuration(session.session_duration)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => openTimeline(session)}
                        className="px-3 py-1 bg-purple-500 text-white text-sm rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-1"
                      >
                        <Clock className="w-4 h-4" />
                        Timeline
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Event Timeline Modal */}
      {showTimeline && selectedSession && (
        <EventTimeline 
          session={selectedSession}
          onClose={() => setShowTimeline(false)}
        />
      )}
    </>
  );
};

export default SessionRecordings;