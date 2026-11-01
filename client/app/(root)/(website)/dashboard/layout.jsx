"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import { useLogout } from "@/lib/hooks/useLogout";
import { FiX } from 'react-icons/fi';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  FiHome,
  FiCpu,
  FiList,
  FiClock,
  FiLink,
  FiSettings,
  FiSun,
  FiMoon,
  FiMenu,
  FiLogOut
} from 'react-icons/fi';
import Loading from '@/components/dashboard/Loading';


export default function DashboardLayout({ children }) {
  const router = useRouter();

  const {
    data: user,
    isLoading,
    isError,
  } = useCurrentUser();
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const { mutate: logoutUser } = useLogout();
  useEffect(() => {
    if (!isLoading && isError) {
      router.replace('/auth/login');
    }
  }, [isLoading, isError, router]);
  useEffect(() => setMounted(true), []);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <FiHome className="text-xl" /> },
    { name: 'My Bot', path: '/dashboard/bot', icon: <FiCpu className="text-xl" /> },
    { name: 'Orders', path: '/dashboard/orders', icon: <FiList className="text-xl" /> },
    { name: 'History', path: '/dashboard/history', icon: <FiClock className="text-xl" /> },
    { name: 'Exchange', path: '/dashboard/exchange', icon: <FiLink className="text-xl" /> },
    { name: 'Settings', path: '/dashboard/settings', icon: <FiSettings className="text-xl" /> },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }
  if (isError || !user) {
    return null;
  }




  return (
    <div className="h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors duration-300">

      {/* Sidebar */}
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:relative md:translate-x-0`}
      >
        <div className="flex items-center justify-between h-20 px-4 border-b border-slate-200 dark:border-slate-800">
          <h1 className="text-2xl font-bold tracking-tight">
            Bullish<span className="text-green-600">Pixel</span>
          </h1>

          {/* Close button: mobile only */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Close sidebar"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link  onClick={() => setSidebarOpen(!sidebarOpen)} key={item.name} href={item.path}>
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${pathname === item.path
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 font-medium'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </div>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-40">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <FiMenu className="text-2xl" />
          </button>

          <div className="flex-1"></div> {/* Spacer */}

          <div className="flex items-center gap-4">
            <button onClick={() => logoutUser()} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <FiLogOut className='text-red-500' />
            </button>
            {mounted && (

              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {theme === 'dark' ? <FiSun className="text-xl" /> : <FiMoon className="text-xl" />}
              </button>
            )}

            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 flex items-center justify-center font-bold text-green-700 dark:text-green-400">
              RA
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 md:p-8 flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}