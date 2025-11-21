type HashAlgo = "argon2id" | "bcrypt" | "argon2d" | "argon2i";
const ALGO = (Bun.env.PASSWORD_ALGO as HashAlgo) || "bcrypt";

export class Password {
  static hash(plainText: string): Promise<string> {
    return Bun.password.hash(plainText, {
      algorithm: ALGO,
      memoryCost: 16,
      timeCost: 31,
    });
  }

  static compare(plainText: string, hashed: string): Promise<boolean> {
    return Bun.password.verify(plainText, hashed, ALGO);
  }
}
