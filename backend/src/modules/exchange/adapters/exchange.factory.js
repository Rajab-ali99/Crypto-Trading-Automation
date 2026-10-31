import BinanceAdapter from "./binance.adapter.js";

export const createExchangeAdapter = ({
  exchange,
  apiKey,
  apiSecret,
  isTestnet = true,
}) => {
  switch (exchange) {
    case "BINANCE":
      return new BinanceAdapter({
        apiKey,
        apiSecret,
        isTestnet,
      });

    default:
      throw new Error(`Unsupported exchange: ${exchange}`);
  }
};