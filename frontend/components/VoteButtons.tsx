"use client";
import { useState } from "react";
import { ethers } from "ethers";
import ContractABI from "../abi/FHEPrivateVoting.json";

export default function VoteButtons() {
  const [loading, setLoading] = useState(false);

  const sendVote = async (choice: number) => {
    if (!window.ethereum) return alert("Please connect your wallet");
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      const res = await fetch("/api/encryptVote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voteChoice: choice, userAddress: address }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
        ContractABI, // مستقیماً از ContractABI استفاده کن
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
      <button
        onClick={() => sendVote(0)}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        {loading ? "Voting..." : "Vote Alice"}
      </button>
      <button
        onClick={() => sendVote(1)}
        disabled={loading}
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        {loading ? "Voting..." : "Vote Bob"}
      </button>
    </div>
  );
}
