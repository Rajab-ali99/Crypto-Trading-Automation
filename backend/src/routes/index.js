import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import exchangeRoutes from "../modules/exchange/exchange.routes.js";
const router = Router();

router.get("/", (req, res) => {
  res.json({
    message: "Bullish Pixel API",
  });
});
router.use("/auth", authRoutes);
router.use(
  "/exchanges",
  exchangeRoutes
);

export default router;