import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bug, AlertTriangle, ArrowRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface BugSummaryProps {
  bugDistribution: {
    critical: number;
    major: number;
    minor: number;
  };
  totalBugs: number;
}

function BugSummary({ bugDistribution, totalBugs }: BugSummaryProps) {
  const navigate = useNavigate();

  const pieData = [
    { name: 'Critical', value: bugDistribution.critical, color: '#ef4444' },
    { name: 'Major', value: bugDistribution.major, color: '#f97316' },
    { name: 'Minor', value: bugDistribution.minor, color: '#eab308' }
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-black/80 border border-purple-500/30 rounded-lg p-3 backdrop-blur-sm">
          <p className="text-white font-semibold">{data.name}</p>
          <p className="text-gray-300">{data.value} bugs</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-orbitron font-bold text-xl text-cyan-400">Bug Summary</h3>
        <button
          onClick={() => navigate('/results')}
          className="flex items-center text-purple-400 hover:text-purple-300 transition-colors text-sm"
        >
          <span className="mr-1">View Details</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {totalBugs === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bug className="w-8 h-8 text-green-400" />
          </div>
          <h4 className="text-lg font-semibold text-green-400 mb-2">No Bugs Found!</h4>
          <p className="text-gray-400 text-sm">Your applications are running smoothly.</p>
        </div>
      ) : (
        <>
          {/* Total Bugs */}
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-red-400 mb-1">{totalBugs}</div>
            <div className="text-sm text-gray-400">Total Bugs Found</div>
          </div>

          {/* Pie Chart */}
          <div className="h-48 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bug Breakdown */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-300">Critical</span>
              </div>
              <span className="text-red-400 font-semibold">{bugDistribution.critical}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-300">Major</span>
              </div>
              <span className="text-orange-400 font-semibold">{bugDistribution.major}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-300">Minor</span>
              </div>
              <span className="text-yellow-400 font-semibold">{bugDistribution.minor}</span>
            </div>
          </div>

          {/* Critical Alert */}
          {bugDistribution.critical > 0 && (
            <div className="mt-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-red-300 text-sm font-semibold">
                  {bugDistribution.critical} critical issue{bugDistribution.critical !== 1 ? 's' : ''} need{bugDistribution.critical === 1 ? 's' : ''} immediate attention
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default BugSummary;