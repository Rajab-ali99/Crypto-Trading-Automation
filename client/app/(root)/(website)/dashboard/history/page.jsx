"use client";
import React from 'react';

const runHistory = [
  { id: 'RUN-104', strategy: 'Grid Scalper', pair: 'BTC/USDT', duration: '14 hrs 20 mins', trades: 24, profit: '+$420.50', status: 'Completed' },
  { id: 'RUN-103', strategy: 'Grid Scalper', pair: 'ETH/USDT', duration: '48 hrs 00 mins', trades: 62, profit: '+$915.00', status: 'Completed' },
  { id: 'RUN-102', strategy: 'Breakout Signal', pair: 'SOL/USDT', duration: '03 hrs 12 mins', trades: 4, profit: '-$45.20', status: 'Stopped' },
];

export default function HistoryPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold">Execution History</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Review past bot operational runs and overall performance metrics.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-400 uppercase text-xs font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">Run ID</th>
                <th className="p-4">Strategy</th>
                <th className="p-4">Pair</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Total Trades</th>
                <th className="p-4">Realized Profit</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {runHistory.map((run) => (
                <tr key={run.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-mono text-slate-500">{run.id}</td>
                  <td className="p-4 font-semibold">{run.strategy}</td>
                  <td className="p-4 font-medium text-slate-400">{run.pair}</td>
                  <td className="p-4 text-slate-500">{run.duration}</td>
                  <td className="p-4">{run.trades}</td>
                  <td className={`p-4 font-bold ${run.profit.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                    {run.profit}
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-semibold">
                      {run.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}