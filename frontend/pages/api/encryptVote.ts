import type { NextApiRequest, NextApiResponse } from "next";

// 🧩 Dynamically import relayer SDK depending on environment
const loadRelayer = async () => {
  try {
    if (typeof window === "undefined") {
      // 🧠 Server-side (Vercel / Node.js)
      const { createInstance } = await import("@zama-fhe/relayer-sdk/node");
      return createInstance;
    } else {
      // 🧠 Client-side (Browser)
      const { createInstance } = await import("@zama-fhe/relayer-sdk/web");
      return createInstance;
    }
  } catch (err) {
    console.error("❌ Failed to load relayer SDK:", err);
    throw err;
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { vote } = req.body;
    if (vote === undefined) {
      return res.status(400).json({ error: "Missing vote parameter" });
    }

    // ⚙️ Load correct version of SDK
    const createInstance = await loadRelayer();

    // 🧠 Create FHE instance (using Sepolia testnet)
    const fhe = await createInstance({
      chainId: 11155111,
      relayerUrl: process.env.NEXT_PUBLIC_RELAYER_URL || "https://relayer.testnet.zama.cloud",
      verifyingContractAddressDecryption:
        process.env.NEXT_PUBLIC_VERIFYING_CONTRACT_ADDRESS_DECRYPTION ||
        "0xb6E160B1ff80D67Bfe90A85eE06Ce0A2613607D1",
      verifyingContractAddressInputVerification:
        process.env.NEXT_PUBLIC_VERIFYING_CONTRACT_ADDRESS_INPUT ||
        "0x7048C39f048125eDa9d678AEbaDfB22F7900a29F",
      kmsContractAddress:
        process.env.NEXT_PUBLIC_KMS_CONTRACT_ADDRESS ||
        "0x1364CBBf2cDF5032C47d8226a6f6FBD2AFCDacAC",
      inputVerifierContractAddress:
        process.env.NEXT_PUBLIC_INPUT_VERIFIER_CONTRACT_ADDRESS ||
        "0xbc91f3daD1A5F19F8390c400196e58073B6a0BC4",
      aclContractAddress:
        process.env.NEXT_PUBLIC_ACL_CONTRACT_ADDRESS ||
        "0x687820221192C5B662b25367F70076A37bc79b6c",
      gatewayChainId: parseInt(process.env.NEXT_PUBLIC_GATEWAY_CHAIN_ID || "55815", 10),
      network: "sepolia",
    });

    // ✅ Select correct encrypt function
    const encryptFn = (fhe as any).encrypt64 || (fhe as any).encrypt8 || (fhe as any).encrypt;
    if (!encryptFn) throw new Error("No encryption method available in FHE instance");

    // 🔒 Encrypt vote
    const encryptedVote = await encryptFn(vote);

    return res.status(200).json({ encryptedVote });
  } catch (error: any) {
    console.error("❌ Encryption error:", error);
    return res.status(500).json({ error: error.message || "Encryption failed" });
  }
}

