import express from "express";

import authenticate from "../../middleware/auth.middleware.js";
import * as exchangeController from "./exchange.controller.js";

const router = express.Router();

router.post(
  "/connect",
  authenticate,
  exchangeController.connectExchange
);

router.get(
  "/connected",
  authenticate,
  exchangeController.getConnectedExchange
);

router.get(
  "/balances",
  authenticate,
  exchangeController.getExchangeBalances
);
router.get(
  "/symbols",
  authenticate,
  exchangeController.getExchangeSymbols
);
router.delete(
  "/disconnect",
  authenticate,
  exchangeController.disconnectExchange
);
export default router;