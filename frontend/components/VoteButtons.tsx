"use client";
import { useAccount, useWalletClient } from "wagmi";
import { useState } from "react";
import { ethers } from "ethers";
import ContractABI from "../abi/FHEPrivateVoting.json";

export default function VoteButtons() {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [loading, setLoading] = useState(false);

  const sendVote = async (choice: number) => {
    if (!address || !walletClient) return alert("Please connect your wallet");
    setLoading(true);
    try {
      const res = await fetch("/api/encryptVote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voteChoice: choice, userAddress: address }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // ✅ ایجاد signer از walletClient
      const provider = new ethers.BrowserProvider(walletClient.transport);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
        ContractABI.abi,
        signer
      );

      const tx = await contract.voteFHE(data.external, data.attestation);
      await tx.wait();
      alert("✅ Vote submitted successfully!");
    } catch (e: any) {
      console.error(e);
      alert("❌ Error: " + (e.message || JSON.stringify(e)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <button onClick={() => sendVote(0)} disabled={loading}>
        {loading ? "Voting..." : "Vote Alice"}
      </button>
      <button onClick={() => sendVote(1)} disabled={loading}>
        {loading ? "Voting..." : "Vote Bob"}
      </button>
    </div>
  );
}

