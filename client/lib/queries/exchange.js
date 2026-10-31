
export const exchangeKeys = {
  all: ["exchange"],

  connected: (exchange = "BINANCE", isTestnet = true) => [
    ...exchangeKeys.all,
    "connected",
    exchange,
    isTestnet,
  ],

  balances: (exchange = "BINANCE", isTestnet = true) => [
    ...exchangeKeys.all,
    "balances",
    exchange,
    isTestnet,
  ],

  symbols: (exchange = "BINANCE", isTestnet = true) => [
    ...exchangeKeys.all,
    "symbols",
    exchange,
    isTestnet,
  ],
};
