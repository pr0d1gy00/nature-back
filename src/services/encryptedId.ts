import crypto from "crypto";

const algorithm = "aes-256-cbc";
const key = Buffer.from(process.env.ENCRYPTION_KEY!);
const iv = Buffer.from(process.env.ENCRYPTION_IV!);
export const encryptId = (id: string): string => {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(id, "utf8", "hex");
  encrypted += cipher.final("hex");

  return encrypted;
};

export const decryptId = (encryptedId: string): string => {
  console.log("Decrypting ID:", encryptedId);
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedId, "hex", "utf8");
  decrypted += decipher.final("utf8");
  console.log("Decrypted ID:", decrypted);
  return decrypted;
};
