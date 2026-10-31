import prisma from "../../config/database.js";
import {
  encrypt,
  decrypt,
} from "../../utils/encryption.js";
import ApiError from "../../utils/ApiError.js";

import {
  exchangeSchema,
  exchangeNameSchema,
} from "./exchange.validation.js";
import { createExchangeAdapter } from "./adapters/exchange.factory.js";

export const connectExchange = async (userId, data) => {
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  // Validate only user-controlled request data
  const validatedData = exchangeSchema.safeParse(data);

  if (!validatedData.success) {
    throw new ApiError(
      400,
      "Invalid exchange connection data",
      validatedData.error.flatten().fieldErrors
    );
  }

  const {
    exchange,
    apiKey,
    apiSecret,
    isTestnet,
  } = validatedData.data;

  // Create the appropriate exchange adapter
  const adapter = createExchangeAdapter({
    exchange,
    apiKey,
    apiSecret,
    isTestnet,
  });

  // Verify credentials with Binance
  const validation = await adapter.validateCredentials();

  if (!validation.spotEnabled) {
    throw new ApiError(
      400,
      "Spot trading is not enabled for this account"
    );
  }

  if (!validation.canTrade) {
    throw new ApiError(
      400,
      "Trading is not enabled for this API key"
    );
  }

  // Check whether this exchange/environment
  // is already connected by this user
  const existingAccount = await prisma.exchangeAccount.findUnique({
    where: {
      userId_exchange_isTestnet: {
        userId,
        exchange,
        isTestnet,
      },
    },
  });

  if (existingAccount) {
    throw new ApiError(
      409,
      "This exchange account is already connected"
    );
  }

  // Encrypt credentials before storing them
  const apiKeyEncrypted = encrypt(apiKey);
  const apiSecretEncrypted = encrypt(apiSecret);

  const exchangeAccount = await prisma.exchangeAccount.create({
    data: {
      userId,
      exchange,
      apiKeyEncrypted,
      apiSecretEncrypted,
      isTestnet,
      status: "CONNECTED",
      lastConnectedAt: new Date(),
      lastError: null,
    },

    select: {
      id: true,
      exchange: true,
      status: true,
      isTestnet: true,
      lastConnectedAt: true,
      createdAt: true,
    },
  });

  return exchangeAccount;
};
export const getConnectedExchange = async (
  userId,
  exchange,
  isTestnet = true
) => {
  if (!userId) {
    throw new ApiError(
      401,
      "Unauthorized"
    );
  }

  const validatedExchange =
    exchangeNameSchema.safeParse(exchange);

  if (!validatedExchange.success) {
    throw new ApiError(
      400,
      "Invalid exchange"
    );
  }

  const exchangeAccount =
    await prisma.exchangeAccount.findUnique({
      where: {
        userId_exchange_isTestnet: {
          userId,
          exchange: validatedExchange.data,
          isTestnet,
        },
      },

      select: {
        id: true,
        exchange: true,
        status: true,
        isTestnet: true,
        lastConnectedAt: true,
        lastError: true,
        createdAt: true,
        updatedAt: true,
      },
    });

  if (!exchangeAccount) {
    throw new ApiError(
      404,
      "Exchange account not found"
    );
  }

  return exchangeAccount;
};
export const getExchangeBalances = async (
  userId,
  exchange,
  isTestnet = true
) => {
  if (!userId) {
    throw new ApiError(
      401,
      "Unauthorized"
    );
  }

  const validatedExchange =
    exchangeNameSchema.safeParse(exchange);

  if (!validatedExchange.success) {
    throw new ApiError(
      400,
      "Invalid exchange"
    );
  }

  const exchangeAccount =
    await prisma.exchangeAccount.findUnique({
      where: {
        userId_exchange_isTestnet: {
          userId,
          exchange: validatedExchange.data,
          isTestnet,
        },
      },
    });

  if (!exchangeAccount) {
    throw new ApiError(
      404,
      "Exchange account not found"
    );
  }

  if (exchangeAccount.status !== "CONNECTED") {
    throw new ApiError(
      400,
      "Exchange account is not connected"
    );
  }

  const apiKey = decrypt(
    exchangeAccount.apiKeyEncrypted
  );

  const apiSecret = decrypt(
    exchangeAccount.apiSecretEncrypted
  );

  const adapter = createExchangeAdapter({
    exchange: exchangeAccount.exchange,
    apiKey,
    apiSecret,
    isTestnet: exchangeAccount.isTestnet,
  });

  const balances = await adapter.getBalances();

  return balances;
};
export const getExchangeSymbols = async (
  userId,
  exchange,
  isTestnet = true
) => {
  if (!userId) {
    throw new ApiError(
      401,
      "Unauthorized"
    );
  }

  const validatedExchange =
    exchangeNameSchema.safeParse(exchange);

  if (!validatedExchange.success) {
    throw new ApiError(
      400,
      "Invalid exchange"
    );
  }

  const exchangeAccount =
    await prisma.exchangeAccount.findUnique({
      where: {
        userId_exchange_isTestnet: {
          userId,
          exchange: validatedExchange.data,
          isTestnet,
        },
      },
    });

  if (!exchangeAccount) {
    throw new ApiError(
      404,
      "Exchange account not found"
    );
  }

  if (exchangeAccount.status !== "CONNECTED") {
    throw new ApiError(
      400,
      "Exchange account is not connected"
    );
  }

  const apiKey = decrypt(
    exchangeAccount.apiKeyEncrypted
  );

  const apiSecret = decrypt(
    exchangeAccount.apiSecretEncrypted
  );

  const adapter = createExchangeAdapter({
    exchange: exchangeAccount.exchange,
    apiKey,
    apiSecret,
    isTestnet: exchangeAccount.isTestnet,
  });

  const symbols = await adapter.getSymbols();

  return symbols;
};
export const disconnectExchange = async (
  userId,
  exchange,
  isTestnet = true
) => {
  if (!userId) {
    throw new ApiError(
      401,
      "Unauthorized"
    );
  }

  const validatedExchange =
    exchangeNameSchema.safeParse(exchange);

  if (!validatedExchange.success) {
    throw new ApiError(
      400,
      "Invalid exchange"
    );
  }

  const exchangeAccount =
    await prisma.exchangeAccount.findUnique({
      where: {
        userId_exchange_isTestnet: {
          userId,
          exchange: validatedExchange.data,
          isTestnet,
        },
      },

      select: {
        id: true,
      },
    });

  if (!exchangeAccount) {
    throw new ApiError(
      404,
      "Exchange account not found"
    );
  }

  await prisma.exchangeAccount.delete({
    where: {
      id: exchangeAccount.id,
    },
  });

  return true;
};