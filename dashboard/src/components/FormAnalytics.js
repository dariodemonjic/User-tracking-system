import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FileText, Clock, AlertCircle, TrendingDown } from 'lucide-react';

const API_URL = 'http://localhost:3001/api/analytics';

const FormAnalytics = ({ dateRange, formatNumber, COLORS }) => {
  const [formData, setFormData] = useState({
    fieldPerformance: [],
    formCompletionRates: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFormAnalytics();
  }, [dateRange]);

  const fetchFormAnalytics = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(dateRange);
      const response = await fetch(`${API_URL}/forms?${params}`);
      const data = await response.json();
      setFormData(data);
    } catch (error) {
      console.error('Error fetching form analytics:', error);
      // Set default empty data
      setFormData({
        fieldPerformance: [],
        formCompletionRates: []
      });
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  // Calculate average completion rate
  const avgCompletionRate = formData.formCompletionRates?.length > 0 
    ? formData.formCompletionRates.reduce((acc, form) => acc + (form.rate || 0), 0) / formData.formCompletionRates.length
    : 0;

  // Find problematic fields (low completion rate or high time)
  const problematicFields = formData.fieldPerformance?.filter(field => 
    (field.completionRate < 70 || field.avgTime > 10)
  ) || [];

  return (
    <div className="space-y-6">
      {/* Form Analytics Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" />
            Form Analytics
          </h2>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Good Performance</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Needs Attention</span>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{avgCompletionRate.toFixed(1)}%</p>
              </div>
              {avgCompletionRate < 50 ? (
                <AlertCircle className="w-8 h-8 text-red-500" />
              ) : (
                <FileText className="w-8 h-8 text-green-500" />
              )}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Forms Tracked</p>
                <p className="text-2xl font-bold text-gray-900">{formData.formCompletionRates?.length || 0}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Problem Fields</p>
                <p className="text-2xl font-bold text-gray-900">{problematicFields.length}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Form Completion Rates */}
        {formData.formCompletionRates?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-md font-medium text-gray-700 mb-3">Form Completion Rates</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={formData.formCompletionRates}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="formName" angle={-45} textAnchor="end" height={80} />
                <YAxis suffix="%" />
                <Tooltip formatter={(value) => `${typeof value === 'number' ? value.toFixed(1) : parseFloat(value || 0).toFixed(1)}%`} />
                <Bar dataKey="rate" fill="#3B82F6" radius={[8, 8, 0, 0]}>
                  {formData.formCompletionRates.map((entry, index) => (
                    <Bar key={`cell-${index}`} fill={entry.rate > 70 ? '#10B981' : entry.rate > 40 ? '#F59E0B' : '#EF4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Field Performance - Time Spent */}
        {formData.fieldPerformance?.length > 0 && (
          <div>
            <h3 className="text-md font-medium text-gray-700 mb-3">Average Time per Field (seconds)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={formData.fieldPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="field_type" />
                <YAxis />
                <Tooltip formatter={(value) => `${parseFloat(value).toFixed(2)}s`} />
                <Line 
                  type="monotone" 
                  dataKey="avgTime" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  dot={{ fill: '#8B5CF6', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Problem Areas Alert */}
        {problematicFields.length > 0 && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-900">Fields Requiring Attention</h4>
                <ul className="mt-2 space-y-1">
                  {problematicFields.map((field, idx) => {
                    const completionRate = parseFloat(field.completionRate || 0);
                    const avgTime = parseFloat(field.avgTime || 0);
                    return (
                      <li key={idx} className="text-sm text-red-700">
                        <strong>{field.field_type}</strong>: 
                        {completionRate < 70 && ` Low completion (${completionRate.toFixed(1)}%)`}
                        {avgTime > 10 && ` High time spent (${avgTime.toFixed(1)}s)`}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* No Data Message */}
        {(!formData.formCompletionRates || formData.formCompletionRates.length === 0) && 
         (!formData.fieldPerformance || formData.fieldPerformance.length === 0) && (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No form data available for the selected period</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormAnalytics;