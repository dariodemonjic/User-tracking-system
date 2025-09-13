import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Monitor, Smartphone, Tablet } from 'lucide-react';

const TrafficAnalysis = ({ sources, devices, formatNumber, COLORS }) => {
  const getDeviceIcon = (type) => {
    switch(type?.toLowerCase()) {
      case 'mobile': return <Smartphone className="w-4 h-4" />;
      case 'tablet': return <Tablet className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Traffic Sources */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={sources}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({source, percent}) => `${source} ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="sessions"
            >
              {sources.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Device Breakdown */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Device Breakdown</h2>
        <div className="space-y-4">
          {devices.slice(0, 5).map((device, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getDeviceIcon(device.device_type)}
                <div>
                  <p className="text-sm font-medium text-gray-900">{device.device_type}</p>
                  <p className="text-xs text-gray-500">{device.browser} · {device.os}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">{formatNumber(device.sessions)}</p>
                <p className="text-xs text-gray-500">sessions</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrafficAnalysis;