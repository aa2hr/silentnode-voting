import type { NextApiRequest, NextApiResponse } from "next";
import { createInstance, SepoliaConfig } from "@zama-fhe/relayer-sdk";
import { Wallet, providers } from "ethers";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { voteChoice, userAddress } = req.body;
    if (![0, 1].includes(voteChoice)) return res.status(400).json({ error: "invalid choice" });

    const fhevm = await createInstance({
      ...SepoliaConfig,
      network: process.env.NEXT_PUBLIC_RPC_URL || process.env.RPC_URL,
      relayerUrl: process.env.RELAYER_URL,
    });

    const publicKey = await fhevm.getPublicKey(userAddress);

    const encrypted = await fhevm.encrypt8(voteChoice);
    const external = fhevm.toExternalEncrypted(encrypted, publicKey);

    const provider = new providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL || process.env.RPC_URL);
    const serverWallet = new Wallet(process.env.PRIVATE_KEY!, provider);

    const attestation = await fhevm.generateAttestation(external, serverWallet);

    return res.status(200).json({ external, attestation });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message || String(err) });
  }
}

