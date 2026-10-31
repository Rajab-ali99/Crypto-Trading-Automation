import { Spot } from "@binance/spot";

import ExchangeAdapter from "./exchange.adapter.js";
import { BINANCE_CONFIG } from "../../../config/exchange.config.js";

class BinanceAdapter extends ExchangeAdapter {
  constructor({ apiKey, apiSecret, isTestnet = true }) {
    super();

    if (!apiKey || !apiSecret) {
      throw new Error("Binance API key and secret are required.");
    }

    this.isTestnet = isTestnet;

    const configurationRestAPI = {
      apiKey,
      apiSecret,
      basePath: isTestnet
        ? BINANCE_CONFIG.TESTNET_BASE_URL
        : BINANCE_CONFIG.MAINNET_BASE_URL,

      timeout: 5000,
      retries: 3,
      backoff: 1000,
      keepAlive: true,
    };

    this.client = new Spot({
      configurationRestAPI,
    });
  }

  async getAccountInfo() {
    const response = await this.client.restAPI.getAccount();

    return response.data();
  }

  async validateCredentials() {
    const account = await this.getAccountInfo();

    return {
      valid: true,
      canTrade: account.canTrade === true,
      accountType: account.accountType,
      spotEnabled:
        Array.isArray(account.permissions) &&
        account.permissions.includes("SPOT"),
    };
  }

  async getBalances() {
    const account = await this.getAccountInfo();

    return account.balances
      .map((balance) => ({
        asset: balance.asset,
        free: balance.free,
        locked: balance.locked,
      }))
      .filter(
        (balance) =>
          Number(balance.free) > 0 ||
          Number(balance.locked) > 0
      );
  }

  async getSymbols() {
    const response = await this.client.restAPI.exchangeInfo();

    const data = await response.data();

    return data.symbols
      .filter((symbol) => symbol.status === "TRADING")
      .map((symbol) => ({
        symbol: symbol.symbol,
        baseAsset: symbol.baseAsset,
        quoteAsset: symbol.quoteAsset,
        status: symbol.status,
      }));
  }
}

export default BinanceAdapter;