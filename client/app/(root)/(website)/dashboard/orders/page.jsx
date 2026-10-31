"use client";
import React, { useState } from 'react';
import { FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';

const dummyOrders = [
  { id: 'ORD-9082', pair: 'BTC/USDT', side: 'BUY', price: '64,200.00', amount: '0.05 BTC', status: 'Filled', time: '10:42 AM' },
  { id: 'ORD-9083', pair: 'BTC/USDT', side: 'SELL', price: '66,800.00', amount: '0.05 BTC', status: 'Open', time: '10:45 AM' },
  { id: 'ORD-9084', pair: 'BTC/USDT', side: 'BUY', price: '62,900.00', amount: '0.05 BTC', status: 'Open', time: '10:46 AM' },
  { id: 'ORD-9085', pair: 'ETH/USDT', side: 'BUY', price: '3,400.00', amount: '1.20 ETH', status: 'Cancelled', time: '09:15 AM' },
];

export default function OrdersPage() {
  const [filter, setFilter] = useState('All');

  const filteredOrders = dummyOrders.filter(o => filter === 'All' || o.status === filter);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Orders & Live Status</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Track order placements, fills, and active execution logs.</p>
        </div>

        {/* Filter Pills */}
        <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-xl gap-1 text-sm font-medium">
          {['All', 'Open', 'Filled', 'Cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1.5 rounded-lg transition-all ${
                filter === tab ? 'bg-white dark:bg-slate-900 shadow-sm text-green-600 dark:text-green-400 font-semibold' : 'text-slate-500'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-400 uppercase text-xs font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Pair</th>
                <th className="p-4">Side</th>
                <th className="p-4">Price</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Time</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-mono text-slate-500">{ord.id}</td>
                  <td className="p-4 font-bold">{ord.pair}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                      ord.side === 'BUY' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-500'
                    }`}>
                      {ord.side}
                    </span>
                  </td>
                  <td className="p-4 font-medium">${ord.price}</td>
                  <td className="p-4 text-slate-500">{ord.amount}</td>
                  <td className="p-4 text-slate-400">{ord.time}</td>
                  <td className="p-4">
                    <StatusBadge status={ord.status} />
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

function StatusBadge({ status }) {
  if (status === 'Filled') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-600 dark:text-green-400">
        <FiCheckCircle /> Filled
      </span>
    );
  }
  if (status === 'Open') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-500">
        <FiClock className="animate-spin" /> Open
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400">
      <FiXCircle /> Cancelled
    </span>
  );
}