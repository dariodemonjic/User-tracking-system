import React from 'react';
import { Globe, TrendingUp } from 'lucide-react';

const BehaviorAnalysis = ({ topPages, scrollDepthData, formatNumber }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Top Pages by Views */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Pages by Views</h2>
        <div className="space-y-3">
          {topPages.length > 0 ? (
            topPages.map((page, index) => {
              const maxViews = topPages[0]?.views || 1;
              const percentage = Math.round((page.views / maxViews) * 100);
              
              return (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {page.page_path || 'Unknown Page'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {page.page_title || 'No title'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{formatNumber(page.views)}</p>
                      <p className="text-xs text-gray-500">{formatNumber(page.unique_views)} unique</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{width: `${percentage}%`}}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Globe className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No page data available</p>
              <p className="text-xs">Start browsing your site to see page analytics</p>
              <p className="text-xs mt-2 text-blue-500">Check browser console for API response details</p>
            </div>
          )}
        </div>
      </div>

      {/* Scroll Depth Distribution */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Scroll Depth Distribution</h2>
        <div className="space-y-3">
          {scrollDepthData.length > 0 ? (
            scrollDepthData
              .filter((item, index) => index % 3 === 0) // Show every 3rd item (0%, 30%, 60%, 90%)
              .map((item, index) => {
                const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];
                const colorClass = colors[index % colors.length];
                
                return (
                  <div key={item.depth}>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>{item.depth}% depth</span>
                      <span>{item.percentage.toFixed(1)}% of users</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-6">
                      <div 
                        className={`${colorClass} h-6 rounded-full flex items-center justify-end pr-2 transition-all duration-500`}
                        style={{width: `${Math.min(item.percentage, 100)}%`}}
                      >
                        {item.percentage > 15 && (
                          <span className="text-xs text-white font-medium">
                            {item.users} users
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
          ) : (
            <div className="text-center py-8 text-gray-500">
              <TrendingUp className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No scroll data available</p>
              <p className="text-xs">Scroll on pages to see depth analytics</p>
              <p className="text-xs mt-2 text-blue-500">Check browser console for API response details</p>
            </div>
          )}
        </div>
        
        {scrollDepthData.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-2">Scroll Statistics</p>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {scrollDepthData.find(d => d.depth === 0)?.users || 0}
                  </p>
                  <p className="text-xs text-gray-500">Total Users</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {(scrollDepthData.find(d => d.depth === 100)?.percentage || 0).toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-500">Reach Bottom</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BehaviorAnalysis;