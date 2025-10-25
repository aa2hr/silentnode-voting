"use client";
import { useState } from "react";
import { ethers } from "ethers";
import ContractABI from "../abi/FHEPrivateVoting.json";

export default function VoteButtons() {
  const [loading, setLoading] = useState(false);

  const sendVote = async (choice: number) => {
    if (typeof window === "undefined" || !window.ethereum) {
      alert("Please connect your wallet first");
      return;
    }

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
        ContractABI, // ✅ مستقیماً از ContractABI استفاده کن
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
    <div className="flex flex-col gap-4 items-center mt-6">
      <button
        onClick={() => sendVote(0)}
        disabled={loading}
        className="px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? "Voting..." : "Vote Alice"}
      </button>

      <button
        onClick={() => sendVote(1)}
        disabled={loading}
        className="px-6 py-3 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition disabled:opacity-50"
      >
        {loading ? "Voting..." : "Vote Bob"}
      </button>
    </div>
  );
}
