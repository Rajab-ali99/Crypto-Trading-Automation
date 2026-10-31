import api from "../api";

export const connectExchange = async ({
  exchange,
  apiKey,
  apiSecret,
  isTestnet,
}) => {
  const response = await api.post("/api/exchanges/connect", {
    exchange,
    apiKey,
    apiSecret,
    isTestnet,
  });

  return response.data;
};

export const getConnectedExchange = async ({
  exchange = "BINANCE",
  isTestnet = true,
}) => {
  const response = await api.get("/api/exchanges/connected", {
    params: {
      exchange,
      isTestnet,
    },
  });

  return response.data;
};

export const getBalances = async ({
  exchange = "BINANCE",
  isTestnet = true,
}) => {
  const response = await api.get("/api/exchanges/balances", {
    params: {
      exchange,
      isTestnet,
    },
  });

  return response.data;
};

export const getSymbols = async ({
  exchange = "BINANCE",
  isTestnet = true,
}) => {
  const response = await api.get("/api/exchanges/symbols", {
    params: {
      exchange,
      isTestnet,
    },
  });

  return response.data;
};

export const disconnectExchange = async ({
  exchange = "BINANCE",
  isTestnet = true,
}) => {
  const response = await api.delete("/api/exchanges/disconnect", {
    params: {
      exchange,
      isTestnet,
    },
  });

  return response.data;
};