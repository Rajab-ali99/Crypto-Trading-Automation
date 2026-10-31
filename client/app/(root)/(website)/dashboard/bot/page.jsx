"use client";
import React, { useState, useMemo } from 'react';
import { 
  FiPlay, FiPause, FiSquare, FiLayers, FiSliders, 
  FiShield, FiTrendingUp, FiTrendingDown, FiActivity 
} from 'react-icons/fi';

export default function BotSetupPage() {
  const [botStatus, setBotStatus] = useState('Stopped');

  // Base Settings
  const [baseConfig, setBaseConfig] = useState({
    pair: 'BNB/USDT',
    strategy: 'LONG',
    leverage: '10',
    referencePrice: 100,
    spacingType: 'USDT', // 'USDT' or '%'
    amountPerOrder: 25,
  });

  // Upper Strategy (Sell Orders when price goes UP)
  const [upperConfig, setUpperConfig] = useState({
    trigger: 105,
    orders: 10,
    spacing: 1,
  });

  // Lower Strategy (Buy Orders when price goes DOWN)
  const [lowerConfig, setLowerConfig] = useState({
    trigger: 90,
    orders: 10,
    spacing: 1,
  });

  // Risk Management
  const [riskConfig, setRiskConfig] = useState({
    takeProfit: 120,
    stopLoss: 75,
    maxCapital: 500,
  });

  // Calculate the ladders dynamically based on user input
  const { upperLadder, lowerLadder } = useMemo(() => {
    let uLadder = [];
    let lLadder = [];
    
    // Calculate Upper Ladder (Sell Orders)
    let currentUpperPrice = parseFloat(upperConfig.trigger) || 0;
    const uSpacing = parseFloat(upperConfig.spacing) || 0;
    
    for (let i = 1; i <= (parseInt(upperConfig.orders) || 0); i++) {
      uLadder.push({
        level: i,
        price: currentUpperPrice.toFixed(2),
        type: 'Sell',
      });
      if (baseConfig.spacingType === '%') {
        currentUpperPrice = currentUpperPrice * (1 + uSpacing / 100);
      } else {
        currentUpperPrice += uSpacing;
      }
    }

    // Calculate Lower Ladder (Buy Orders)
    let currentLowerPrice = parseFloat(lowerConfig.trigger) || 0;
    const lSpacing = parseFloat(lowerConfig.spacing) || 0;

    for (let i = 1; i <= (parseInt(lowerConfig.orders) || 0); i++) {
      lLadder.push({
        level: i,
        price: currentLowerPrice.toFixed(2),
        type: 'Buy',
      });
      if (baseConfig.spacingType === '%') {
        currentLowerPrice = currentLowerPrice * (1 - lSpacing / 100);
      } else {
        currentLowerPrice -= lSpacing;
      }
    }

    // Reverse upper ladder so the highest price is at the top visually
    return { upperLadder: uLadder.reverse(), lowerLadder: lLadder };
  }, [baseConfig, upperConfig, lowerConfig]);

  const handleBaseChange = (e) => setBaseConfig({ ...baseConfig, [e.target.name]: e.target.value });
  const handleUpperChange = (e) => setUpperConfig({ ...upperConfig, [e.target.name]: e.target.value });
  const handleLowerChange = (e) => setLowerConfig({ ...lowerConfig, [e.target.name]: e.target.value });
  const handleRiskChange = (e) => setRiskConfig({ ...riskConfig, [e.target.name]: e.target.value });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Control Panel Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold">Strategy Engine</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Configure your dynamic trigger limits and execution ladders.</p>
        </div>
        <div className="flex items-center gap-3">
          {botStatus === 'Stopped' ? (
            <button onClick={() => setBotStatus('Running')} className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all shadow-md shadow-green-600/20">
              <FiPlay /> Start Engine
            </button>
          ) : (
            <button onClick={() => setBotStatus('Stopped')} className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all">
              <FiSquare /> Stop Engine
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Form Settings */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Base Configuration */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-slate-800 dark:text-slate-100">
              <FiSliders className="text-blue-500" /> Base Parameters
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">Pair</label>
                <input type="text" name="pair" value={baseConfig.pair} onChange={handleBaseChange} className="w-full mt-1 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">Current Price (Ref)</label>
                <input type="number" name="referencePrice" value={baseConfig.referencePrice} onChange={handleBaseChange} className="w-full mt-1 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">Spacing Unit</label>
                <select name="spacingType" value={baseConfig.spacingType} onChange={handleBaseChange} className="w-full mt-1 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                  <option value="USDT">Fixed (USDT)</option>
                  <option value="%">Percentage (%)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upper Strategy Form */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-red-200 dark:border-red-900/30 shadow-sm">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-red-600 dark:text-red-400">
                <FiTrendingUp /> Upper Strategy
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase">Activation Trigger</label>
                  <input type="number" name="trigger" value={upperConfig.trigger} onChange={handleUpperChange} className="w-full mt-1 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase">Order Count</label>
                    <input type="number" name="orders" value={upperConfig.orders} onChange={handleUpperChange} className="w-full mt-1 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase">Spacing ({baseConfig.spacingType})</label>
                    <input type="number" name="spacing" value={upperConfig.spacing} onChange={handleUpperChange} className="w-full mt-1 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950" />
                  </div>
                </div>
              </div>
            </div>

            {/* Lower Strategy Form */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-green-200 dark:border-green-900/30 shadow-sm">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-green-600 dark:text-green-400">
                <FiTrendingDown /> Lower Strategy
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase">Activation Trigger</label>
                  <input type="number" name="trigger" value={lowerConfig.trigger} onChange={handleLowerChange} className="w-full mt-1 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase">Order Count</label>
                    <input type="number" name="orders" value={lowerConfig.orders} onChange={handleLowerChange} className="w-full mt-1 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase">Spacing ({baseConfig.spacingType})</label>
                    <input type="number" name="spacing" value={lowerConfig.spacing} onChange={handleLowerChange} className="w-full mt-1 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Risk Management Form */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-slate-800 dark:text-slate-100">
              <FiShield className="text-amber-500" /> Risk & Position Rules
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">Direction</label>
                <select name="strategy" value={baseConfig.strategy} onChange={handleBaseChange} className="w-full mt-1 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                  <option value="LONG">LONG</option>
                  <option value="SHORT">SHORT</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">Leverage (x)</label>
                <input type="number" name="leverage" value={baseConfig.leverage} onChange={handleBaseChange} className="w-full mt-1 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">Take Profit</label>
                <input type="number" name="takeProfit" value={riskConfig.takeProfit} onChange={handleRiskChange} className="w-full mt-1 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-green-600 font-bold" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">Stop Loss</label>
                <input type="number" name="stopLoss" value={riskConfig.stopLoss} onChange={handleRiskChange} className="w-full mt-1 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-red-500 font-bold" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Ladder Preview */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full max-h-[850px]">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-slate-800 dark:text-slate-100">
            <FiLayers className="text-indigo-500" /> Execution Preview
          </h3>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-1 custom-scrollbar">
            
            {/* Upper Ladder (Sells) */}
            {upperLadder.map((ord, idx) => (
              <div key={`up-${idx}`} className="flex justify-between items-center p-2.5 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 text-sm">
                <span className="font-mono text-red-400 text-xs">Sell #{upperLadder.length - idx}</span>
                <span className="text-red-600 dark:text-red-400 font-bold">{ord.price}</span>
              </div>
            ))}

            {/* Upper Trigger Line */}
            <div className="flex items-center gap-2 py-2">
              <div className="flex-1 h-px bg-red-300 dark:bg-red-800 border-dashed border-t"></div>
              <span className="text-xs font-bold text-red-500 uppercase">🛑 Upper Trigger ({upperConfig.trigger})</span>
              <div className="flex-1 h-px bg-red-300 dark:bg-red-800 border-dashed border-t"></div>
            </div>

            {/* Current Market Price */}
            <div className="flex justify-between items-center p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 my-4 shadow-inner">
              <span className="flex items-center gap-2 font-bold text-slate-600 dark:text-slate-300">
                <FiActivity className="text-blue-500" /> Reference Price
              </span>
              <span className="text-lg font-black text-slate-900 dark:text-white">{baseConfig.referencePrice}</span>
            </div>

            {/* Lower Trigger Line */}
            <div className="flex items-center gap-2 py-2">
              <div className="flex-1 h-px bg-green-300 dark:bg-green-800 border-dashed border-t"></div>
              <span className="text-xs font-bold text-green-600 uppercase">🛑 Lower Trigger ({lowerConfig.trigger})</span>
              <div className="flex-1 h-px bg-green-300 dark:bg-green-800 border-dashed border-t"></div>
            </div>

            {/* Lower Ladder (Buys) */}
            {lowerLadder.map((ord, idx) => (
              <div key={`low-${idx}`} className="flex justify-between items-center p-2.5 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 text-sm">
                <span className="font-mono text-green-500 text-xs">Buy #{idx + 1}</span>
                <span className="text-green-600 dark:text-green-400 font-bold">{ord.price}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500">
            *Orders are visualized mathematically based on current input parameters. Actual execution relies on real-time WebSocket market data.
          </div>
        </div>

      </div>
    </div>
  );
}