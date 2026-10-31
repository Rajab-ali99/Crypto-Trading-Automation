import asyncHandler from "../../utils/asyncHandler.js";
import * as exchangeService from "./exchange.service.js";

export const connectExchange = asyncHandler(
  async (req, res) => {
    const exchangeAccount =
      await exchangeService.connectExchange(
        req.user.id,
        req.body
      );

    res.status(201).json({
      success: true,
      message: "Exchange connected successfully",
      data: {
        exchangeAccount,
      },
    });
  }
);
export const getConnectedExchange = asyncHandler(
  async (req, res) => {
    const exchangeAccount =
      await exchangeService.getConnectedExchange(
        req.user.id,
        req.query.exchange,
        req.query.isTestnet !== "false"
      );

    res.status(200).json({
      success: true,
      message:
        "Connected exchange fetched successfully",
      data: {
        exchangeAccount,
      },
    });
  }
);
export const getExchangeBalances = asyncHandler(
  async (req, res) => {
    const balances =
      await exchangeService.getExchangeBalances(
        req.user.id,
        req.query.exchange,
        req.query.isTestnet !== "false"
      );

    res.status(200).json({
      success: true,
      message:
        "Exchange balances fetched successfully",
      data: {
        balances,
      },
    });
  }
);
export const getExchangeSymbols = asyncHandler(
  async (req, res) => {
    const symbols =
      await exchangeService.getExchangeSymbols(
        req.user.id,
        req.query.exchange,
        req.query.isTestnet !== "false"
      );

    res.status(200).json({
      success: true,
      message:
        "Exchange symbols fetched successfully",
      data: {
        symbols,
      },
    });
  }
);
export const disconnectExchange = asyncHandler(
  async (req, res) => {
    await exchangeService.disconnectExchange(
      req.user.id,
      req.query.exchange,
      req.query.isTestnet !== "false"
    );

    res.status(200).json({
      success: true,
      message: "Exchange disconnected successfully",
    });
  }
);