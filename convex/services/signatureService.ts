const signingPublicKey = process.env.RSA_SIGNING_PUBLIC_KEY!;
const signingPrivateKey = process.env.RSA_SIGNING_PRIVATE_KEY!;

export class SignatureService {
  #publicKey: CryptoKey | null = null;
  #privateKey: CryptoKey | null = null;

  async sign(data: string): Promise<string> {
    if (!this.#privateKey) {
      this.#privateKey = await this.#getPrivateKey();
    }

    const signature = await crypto.subtle.sign(
      { name: "RSA-PSS", saltLength: 32 },
      this.#privateKey,
      new TextEncoder().encode(data),
    );

    const base64 = btoa(String.fromCharCode(...new Uint8Array(signature)));

    return base64;
  }

  async verify(base64Signature: string, data: string): Promise<boolean> {
    if (!this.#publicKey) {
      this.#publicKey = await this.#getPublicKey();
    }

    const signature = Uint8Array.from(atob(base64Signature), (c) =>
      c.charCodeAt(0),
    );

    return await crypto.subtle.verify(
      { name: "RSA-PSS", saltLength: 32 },
      this.#publicKey,
      signature,
      new TextEncoder().encode(data),
    );
  }

  #getPublicKey = async () =>
    await crypto.subtle.importKey(
      "spki",
      Uint8Array.from(atob(signingPublicKey), (c) => c.charCodeAt(0)),
      { name: "RSA-PSS", hash: "SHA-256" },
      false,
      ["verify"],
    );

  #getPrivateKey = async () =>
    await crypto.subtle.importKey(
      "pkcs8",
      Uint8Array.from(atob(signingPrivateKey), (c) => c.charCodeAt(0)),
      { name: "RSA-PSS", hash: "SHA-256" },
      false,
      ["sign"],
    );
}
