"use client";
import React, { useState } from "react";
import { Contract } from "ethers";
import type { FhevmInstance } from "@zama-fhe/relayer-sdk/web";

interface VoteFormProps {
  contract: Contract;
  fhe: FhevmInstance | null;
}

export default function VoteForm({ contract, fhe }: VoteFormProps) {
  const [choice, setChoice] = useState<string>("");

  const handleVote = async () => {
    if (!choice) {
      alert("Please enter your choice.");
      return;
    }

    if (!fhe) {
      alert("FHE SDK is not ready yet!");
      return;
    }

    try {
      // Encrypt vote with FHE SDK
      const encryptedVote = fhe.encrypt8(choice);
      console.log("Encrypted vote:", encryptedVote);

      // Send vote to smart contract
      const tx = await contract.vote(encryptedVote);
      await tx.wait();

      alert("Vote submitted successfully!");
      setChoice("");
    } catch (err) {
      console.error("Error submitting vote:", err);
      alert("Failed to submit vote.");
    }
  };

  return (
    <div className="w-full max-w-md flex flex-col gap-4">
      <input
        type="text"
        placeholder="Enter your choice (e.g., CandidateA)"
        value={choice}
        onChange={(e) => setChoice(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleVote}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
      >
        Submit Vote 🗳
      </button>
    </div>
  );
}
