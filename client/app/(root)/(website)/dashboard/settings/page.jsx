"use client";
import React from 'react';

export default function SettingsPage() {
  return (
    <div className="max-w-3xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold">Account Settings</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Manage security settings and trading preferences.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <h3 className="text-lg font-semibold">Profile Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">Full Name</label>
            <input 
              type="text" 
              defaultValue="Rajab Ali"
              className="w-full mt-1 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">Email Address</label>
            <input 
              type="email" 
              defaultValue="rajabali@example.com"
              className="w-full mt-1 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm"
            />
          </div>
        </div>

        <hr className="border-slate-200 dark:border-slate-800" />

        <h3 className="text-lg font-semibold">Security</h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">Current Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full mt-1 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase">New Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full mt-1 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase">Confirm New Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full mt-1 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold transition-all">
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
}