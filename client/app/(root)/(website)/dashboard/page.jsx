"use client";
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { FiTrendingUp, FiActivity, FiDollarSign, FiBox } from 'react-icons/fi';

// Dummy Chart Data
const data = [
  { name: 'Mon', value: 4000 }, { name: 'Tue', value: 4200 },
  { name: 'Wed', value: 4100 }, { name: 'Thu', value: 4600 },
  { name: 'Fri', value: 4800 }, { name: 'Sat', value: 5100 },
  { name: 'Sun', value: 5350 },
];

export default function DashboardOverview() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Overview</h2>
        <div className="flex items-center gap-2 px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full text-sm font-medium border border-green-200 dark:border-green-800/50">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Bot is Running
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Current P&L" 
          value="+$1,350.50" 
          subtitle="+18.62% this week"
          icon={<FiTrendingUp className="text-green-500" />}
          trend="up"
        />
        <StatCard 
          title="Selected Pair" 
          value="BTC / USDT" 
          subtitle="Binance Connected"
          icon={<FiActivity className="text-blue-500" />}
        />
        <StatCard 
          title="Allocated Capital" 
          value="$10,000.00" 
          subtitle="$4,250.00 in open orders"
          icon={<FiDollarSign className="text-amber-500" />}
        />
        <StatCard 
          title="Open / Filled Orders" 
          value="4 / 12" 
          subtitle="Grid strategy active"
          icon={<FiBox className="text-purple-500" />}
        />
      </div>

      {/* Chart Section */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-lg font-semibold mb-6">Performance History</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-800" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--tw-bg-opacity)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#16a34a', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="value" stroke="#16a34a" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// Reusable Stat Card Component
function StatCard({ title, value, subtitle, icon, trend }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-green-500/50 transition-colors duration-300">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</h3>
        <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
          {icon}
        </div>
      </div>
      <div>
        <h4 className={`text-2xl font-bold ${trend === 'up' ? 'text-green-600 dark:text-green-400' : ''}`}>
          {value}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>
      </div>
    </div>
  );
}