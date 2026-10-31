import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

const getEncryptionKey = () => {
  const encryptionKey = process.env.EXCHANGE_ENCRYPTION_KEY;

  if (!encryptionKey) {
    throw new Error("EXCHANGE_ENCRYPTION_KEY is not configured.");
  }

  const key = Buffer.from(encryptionKey, "hex");

  if (key.length !== 32) {
    throw new Error(
      "EXCHANGE_ENCRYPTION_KEY must be a 32-byte hex encoded key."
    );
  }

  return key;
};

export const encrypt = (value) => {
  if (!value || typeof value !== "string") {
    throw new Error("Value to encrypt must be a non-empty string.");
  }

  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(value, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return [
    iv.toString("hex"),
    authTag.toString("hex"),
    encrypted.toString("hex"),
  ].join(":");
};

export const decrypt = (encryptedValue) => {
  if (!encryptedValue || typeof encryptedValue !== "string") {
    throw new Error("Encrypted value must be a non-empty string.");
  }

  const parts = encryptedValue.split(":");

  if (parts.length !== 3) {
    throw new Error("Invalid encrypted value.");
  }

  const [ivHex, authTagHex, encryptedHex] = parts;

  const key = getEncryptionKey();

  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const encrypted = Buffer.from(encryptedHex, "hex");

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
};