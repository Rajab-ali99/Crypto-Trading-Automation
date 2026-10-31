import { z } from "zod";

export const exchangeSchema = z.object({
  exchange: z.enum(["BINANCE"]),

  apiKey: z
    .string()
    .trim()
    .min(1, "API key is required"),

  apiSecret: z
    .string()
    .trim()
    .min(1, "API secret is required"),

  isTestnet: z.boolean().optional().default(true),
});

export const exchangeNameSchema = z.enum([
  "BINANCE",
]);