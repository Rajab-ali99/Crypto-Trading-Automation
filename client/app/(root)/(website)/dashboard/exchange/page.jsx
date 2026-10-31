"use client";
import React, { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { exchangeKeys } from '@/lib/queries/exchange';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPlus,
  FiX,
  FiShield,
  FiChevronDown,
  FiLock,
  FiPower,
  FiRefreshCw,
  FiDollarSign,
  FiActivity,
  FiCalendar,
  FiCheckCircle,
  FiSearch
} from 'react-icons/fi';
import { SiBinance } from 'react-icons/si';
import { toast } from 'react-toastify';
import {
  connectExchange,
  getConnectedExchange,
  disconnectExchange,
  getBalances,
  getSymbols
} from "@/lib/api/exchange";
import Loading from '@/components/dashboard/Loading';

export default function ExchangePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Balances and Symbols state
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    exchange: 'binance',
    network: 'testnet',
    apiKey: '',
    secretKey: ''
  });
  const connectMutation = useMutation({
    mutationFn: (payload) => connectExchange(payload),

    onSuccess: async () => {
      toast.success("Exchange connected successfully");

      setIsModalOpen(false);

      setFormData({
        exchange: "binance",
        network: "testnet",
        apiKey: "",
        secretKey: "",
      });

      await queryClient.invalidateQueries({
        queryKey: exchangeKeys.connected("BINANCE", true),
      });
    },

    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        "Failed to connect exchange. Please try again.";

      toast.error(message);
    },
  });
  const disconnectMutation = useMutation({
    mutationFn: (payload) => disconnectExchange(payload),

    onSuccess: async () => {
      toast.success("Exchange disconnected successfully");

      // Clear the cached connection.
      queryClient.setQueryData(
        exchangeKeys.connected("BINANCE", true),
        null
      );

      // Remove stale account data from the cache.
      queryClient.removeQueries({
        queryKey: exchangeKeys.balances("BINANCE", true),
        exact: true,
      });

      queryClient.removeQueries({
        queryKey: exchangeKeys.symbols("BINANCE", true),
        exact: true,
      });

      // Fetch the latest connection status from the backend.
      await queryClient.invalidateQueries({
        queryKey: exchangeKeys.connected("BINANCE", true),
      });
    },

    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        "Failed to disconnect exchange. Please try again.";

      toast.error(message);
    },
  });
  const handleConnect = async (e) => {
    e.preventDefault();

    const payload = {
      exchange: formData.exchange.toUpperCase(),
      isTestnet: formData.network === "testnet",
      apiKey: formData.apiKey,
      apiSecret: formData.secretKey,
    };

    connectMutation.mutate(payload);
  };
  const {
    data: connectedExchangeResponse,
    isPending: isLoadingExchange,
    isError: isExchangeQueryError,
    error: exchangeQueryError,
    refetch: refetchConnectedExchange,
  } = useQuery({
    queryKey: exchangeKeys.connected("BINANCE", true),

    queryFn: async () => {
      try {
        return await getConnectedExchange({
          exchange: "BINANCE",
          isTestnet: true,
        });
      } catch (error) {
        if (error?.response?.status === 404) {
          return null;
        }

        throw error;
      }
    },

    retry: (failureCount, error) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 2;
    },
  });

  const connectedExchange =
    connectedExchangeResponse?.data?.exchangeAccount ?? null;

  const exchangeError = isExchangeQueryError
    ? exchangeQueryError?.response?.data?.message ||
    "Unable to load your exchange connection. Please try again."
    : "";

  const {
    data: balancesResponse,
    isPending: isLoadingBalances,
    isError: isBalancesError,
    error: balancesError,
    refetch: refetchBalances,
  } = useQuery({
    queryKey: exchangeKeys.balances("BINANCE", true),

    queryFn: () =>
      getBalances({
        exchange: "BINANCE",
        isTestnet: true,
      }),

    enabled: Boolean(connectedExchange),
    retry: 1,
  });

  const balances = balancesResponse?.data?.balances ?? [];

  const {
    data: symbolsResponse,
    isPending: isLoadingSymbols,
    isError: isSymbolsError,
    error: symbolsError,
    refetch: refetchSymbols,
  } = useQuery({
    queryKey: exchangeKeys.symbols("BINANCE", true),

    queryFn: () =>
      getSymbols({
        exchange: "BINANCE",
        isTestnet: true,
      }),

    enabled: Boolean(connectedExchange),
    retry: 1,
  });

  const symbols = symbolsResponse?.data?.symbols ?? [];

  const isLoadingData = isLoadingBalances || isLoadingSymbols;

  const exchangeDataError = isBalancesError
    ? balancesError?.response?.data?.message ||
    "Unable to load balances. Please try again."
    : isSymbolsError
      ? symbolsError?.response?.data?.message ||
      "Unable to load market symbols. Please try again."
      : "";
  const handleDisconnect = () => {
    const confirmed = window.confirm(
      "Are you sure you want to disconnect your exchange?"
    );

    if (!confirmed) return;

    disconnectMutation.mutate({
      exchange: connectedExchange?.exchange || "BINANCE",
      isTestnet: connectedExchange?.isTestnet ?? true,
    });
  };

  const refreshExchangeData = async () => {
    await Promise.all([
      refetchBalances(),
      refetchSymbols(),
    ]);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };


  const displayBalances = balances.filter((balance) =>
    (balance.asset || balance.currency || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );



  if (isLoadingExchange) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loading />
      </div>
    );
  }


  if (exchangeError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-center">
          <h2 className="text-lg font-semibold text-red-500">
            Unable to Load Exchange
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {exchangeError}
          </p>

          <button
            type="button"
            onClick={() => refetchConnectedExchange()}
            disabled={isLoadingExchange}
            className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoadingExchange ? "Retrying..." : "Retry"}
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-12">


      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400">
            Exchange
          </h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            {connectedExchange
              ? "Manage your connected exchange credentials, balances, and market access."
              : "Connect your exchange account to start automated trading."}
          </p>
        </div>

        {connectedExchange && (
          <button
            onClick={refreshExchangeData}
            disabled={isLoadingData}
            className="self-start sm:self-center flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
          >
            <FiRefreshCw className={isLoadingData ? "animate-spin text-emerald-500" : "text-slate-400"} /> Refresh
          </button>
        )}
      </div>


      {!connectedExchange ? (


        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/5 dark:to-teal-500/5 blur-[100px] rounded-full pointer-events-none transition-all duration-700 group-hover:scale-110" />

          <div className="relative p-[1px] rounded-[2rem] bg-gradient-to-b from-slate-200 to-white dark:from-slate-800 dark:to-slate-900/50 shadow-2xl shadow-slate-200/50 dark:shadow-black/50">
            <div className="relative flex flex-col items-center justify-center py-24 px-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-[calc(2rem-1px)] text-center overflow-hidden">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="relative mb-8"
              >
                <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full" />
                <div className="relative w-20 h-20 bg-gradient-to-br from-white to-slate-100 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-center shadow-xl shadow-slate-200/50 dark:shadow-black/50">
                  <SiBinance className="text-4xl text-yellow-500 drop-shadow-md" />
                </div>
              </motion.div>

              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
                No exchange connected
              </h3>

              <p className="text-slate-500 dark:text-slate-400 max-w-md mb-10 text-sm leading-relaxed font-medium">
                Connect an exchange account to enable trading, live balances, and real-time market data.
              </p>

              <button
                onClick={() => setIsModalOpen(true)}
                className="relative inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-full hover:from-emerald-400 hover:to-emerald-500 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] border-t border-emerald-400/30"
              >
                <FiPlus className="text-lg" /> Connect Exchange
              </button>
            </div>
          </div>
        </div>

      ) : (


        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">


          <div className="relative p-[1px] rounded-[1.75rem] bg-gradient-to-b from-slate-200 to-transparent dark:from-slate-800 dark:to-slate-900/40 shadow-xl">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 rounded-[calc(1.75rem-1px)]">

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-yellow-500/10 to-yellow-500/20 border border-yellow-500/20 rounded-2xl flex items-center justify-center shadow-inner">
                    <SiBinance className="text-3xl text-yellow-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white capitalize">
                        {connectedExchange.exchange ? connectedExchange.exchange.toLowerCase() : "Exchange"}
                      </h3>
                      <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        {connectedExchange.status || "Connected"}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        Environment:
                        <strong className="text-slate-700 dark:text-slate-200 font-semibold capitalize">
                          {connectedExchange.isTestnet ? "Testnet" : "Mainnet"}
                        </strong>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <FiCalendar className="text-slate-400" /> Connected: {formatDate(connectedExchange.lastConnectedAt || connectedExchange.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Disconnect Button */}
                <button
                  onClick={handleDisconnect}
                  disabled={disconnectMutation.isPending}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 border border-red-200 dark:border-red-500/20 transition-all self-start md:self-auto"
                >
                  <FiPower />
                  {disconnectMutation.isPending ? "Disconnecting..." : "Disconnect Exchange"}
                </button>
              </div>

              {/* Quick Metrics Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">
                    <FiDollarSign className="text-emerald-500 text-sm" /> Total Assets Count
                  </div>
                  <div className="text-xl font-bold text-slate-900 dark:text-white font-mono">
                    {displayBalances.length} Available
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">
                    <FiActivity className="text-emerald-500 text-sm" /> Market Symbols
                  </div>
                  <div className="text-xl font-bold text-slate-900 dark:text-white font-mono">
                    {symbols.length > 0 ? `${symbols.length} Pairs` : "Ready"}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">
                    <FiShield className="text-emerald-500 text-sm" /> Permissions
                  </div>
                  <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Spot trading enabled
                  </div>
                </div>
              </div>

            </div>
          </div>


          <div className="relative p-[1px] rounded-[1.75rem] bg-gradient-to-b from-slate-200 to-transparent dark:from-slate-800 dark:to-slate-900/40 shadow-xl overflow-hidden">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 rounded-[calc(1.75rem-1px)]">

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Assets & Balances</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Real-time balances synced from your exchange wallet.</p>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <FiSearch className="absolute left-3.5 top-3 text-slate-400 text-sm" />
                  <input
                    type="text"
                    placeholder="Search asset..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-60 pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 outline-none focus:border-emerald-500 transition-all font-medium"
                  />
                </div>
              </div>

              {exchangeDataError && (
                <div
                  role="alert"
                  className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4"
                >
                  <p className="text-sm text-red-500">
                    {exchangeDataError}
                  </p>

                  <button
                    type="button"
                    onClick={refreshExchangeData}
                    disabled={isLoadingData}
                    className="rounded-lg border border-red-500/30 px-3 py-2 text-sm text-red-500 transition hover:bg-red-500/10 disabled:opacity-50"
                  >
                    {isLoadingData ? "Retrying..." : "Retry"}
                  </button>
                </div>
              )}

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-3 px-4">Asset</th>
                      <th className="py-3 px-4">Available</th>
                      <th className="py-3 px-4">Locked</th>
                      <th className="py-3 px-4 text-right">Status</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm font-medium">
                    {isLoadingData ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="py-8 px-4 text-center text-slate-500 dark:text-slate-400"
                        >
                          Loading balances...
                        </td>
                      </tr>
                    ) : displayBalances.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="py-8 px-4 text-center text-slate-500 dark:text-slate-400"
                        >
                          {balances.length === 0
                            ? "No balances found for this account."
                            : "No assets match your search."}
                        </td>
                      </tr>
                    ) : (
                      displayBalances.map((item, index) => {
                        const asset = item.asset || item.currency || `Asset-${index}`;
                        const free = item.free ?? item.available ?? item.amount ?? "0.00";
                        const locked = item.locked ?? "0.00";

                        return (
                          <tr
                            key={`${asset}-${index}`}
                            className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                          >
                            <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                              <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-extrabold">
                                {asset.charAt(0)}
                              </span>
                              {asset}
                            </td>

                            <td className="py-3.5 px-4 font-mono text-slate-700 dark:text-slate-300">
                              {free}
                            </td>

                            <td className="py-3.5 px-4 font-mono text-slate-400 dark:text-slate-500">
                              {locked}
                            </td>

                            <td className="py-3.5 px-4 text-right">
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                <FiCheckCircle className="text-xs" /> Active
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>

                </table>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* CONNECTION MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md p-[1px] rounded-[1.5rem] bg-gradient-to-b from-slate-200 to-white dark:from-slate-700 dark:to-slate-900 shadow-2xl"
            >
              <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-[calc(1.5rem-1px)] overflow-hidden">
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/50">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FiLock className="text-emerald-500" /> Connect Exchange
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-all bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 p-2 rounded-full shadow-sm hover:rotate-90"
                  >
                    <FiX />
                  </button>
                </div>

                <form onSubmit={handleConnect} className="p-6 space-y-6">
                  {/* Exchange Select */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">Exchange</label>
                    <div className="relative group">
                      <select
                        value={formData.exchange}
                        onChange={(e) => setFormData({ ...formData, exchange: e.target.value })}
                        className="w-full p-3.5 pl-12 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-slate-100 font-semibold focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all appearance-none cursor-pointer shadow-inner"
                      >
                        <option value="binance">Binance</option>
                        <option value="bybit">Bybit</option>
                        <option value="kucoin">KuCoin</option>
                      </select>
                      <SiBinance className="absolute left-4 top-4 text-yellow-500 text-lg" />
                      <FiChevronDown className="absolute right-4 top-4 text-slate-400 pointer-events-none transition-transform group-hover:translate-y-0.5" />
                    </div>
                  </div>

                  {/* Environment Toggle */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">Environment</label>
                    <div className="flex p-1 bg-slate-100/80 dark:bg-slate-950/80 rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-inner">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, network: 'testnet' })}
                        className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${formData.network === 'testnet'
                          ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200/50 dark:border-slate-700/50'
                          : 'text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                          }`}
                      >
                        Testnet
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, network: 'mainnet' })}
                        className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${formData.network === 'mainnet'
                          ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200/50 dark:border-slate-700/50'
                          : 'text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                          }`}
                      >
                        Mainnet
                      </button>
                    </div>
                  </div>

                  {/* API Key */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">API Key</label>
                    <input
                      required
                      type="text"
                      value={formData.apiKey}
                      onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                      className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-mono text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700 shadow-inner"
                    />
                  </div>

                  {/* API Secret */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">API Secret</label>
                    <input
                      required
                      type="password"
                      placeholder="•••••••••••••••••••••••"
                      value={formData.secretKey}
                      onChange={(e) => setFormData({ ...formData, secretKey: e.target.value })}
                      className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-mono text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700 shadow-inner"
                    />
                  </div>

                  {/* Security Badge */}
                  <div className="flex items-center gap-3 p-3.5 bg-gradient-to-r from-emerald-50 to-transparent dark:from-emerald-500/10 dark:to-transparent border-l-2 border-emerald-500 rounded-r-xl">
                    <div className="p-1.5 bg-emerald-100 dark:bg-emerald-500/20 rounded-md">
                      <FiShield className="text-emerald-600 dark:text-emerald-400 text-lg" />
                    </div>
                    <p className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                      Your API credentials are securely encrypted before being stored.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 px-4 py-3.5 rounded-xl font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={connectMutation.isPending}
                      className="flex-1 px-4 py-3.5 rounded-xl font-bold text-white bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-70 flex items-center justify-center gap-2 border-t border-emerald-400/30 relative overflow-hidden"
                    >
                      {connectMutation.isPending ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      ) : (
                        'Connect'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}