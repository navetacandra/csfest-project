import jwt from "jsonwebtoken";

export class JWT {
  protected static SECRET: string =
    Bun.env.JWT_SECRET ||
    Bun.CryptoHasher.hash(
      "sha512",
      Bun.randomUUIDv7("buffer", Date.now()).toHex(),
    ).toHex();

  static sign(payload: object): string {
    return jwt.sign(payload, this.SECRET, {
      algorithm: "HS512",
      expiresIn: "8h",
    });
  }

  static verify(token: string): boolean {
    try {
      jwt.verify(token, this.SECRET, {
        algorithms: ["HS512"],
      });
      return true;
    } catch (_) {
      return false;
    }
  }

  static decode<T>(token: string): T {
    if (!this.verify(token)) return undefined as T;
    return jwt.decode(token, {
      complete: false,
    }) as T;
  }
}
