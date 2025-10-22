"use client";
import { useAccount, useSigner } from "wagmi";
import { useState } from "react";
import { ethers } from "ethers";
import ContractABI from "../abi/FHEPrivateVoting.json"; // compile output ABI

export default function VoteButtons() {
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const [loading, setLoading] = useState(false);

  const sendVote = async (choice: number) => {
    if (!address || !signer) return alert("Connect wallet");
    setLoading(true);
    try {
      const res = await fetch("/api/encryptVote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voteChoice: choice, userAddress: address })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const contract = new ethers.Contract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!, ContractABI, signer);
      // call voteFHE(externalEuint8, attestation)
      const tx = await contract.voteFHE(data.external, data.attestation);
      await tx.wait();
      alert("Vote submitted");
    } catch (e: any) {
      console.error(e);
      alert("Error: " + (e.message || JSON.stringify(e)));
    } finally { setLoading(false); }
  };

  return (
    <div>
      <button onClick={() => sendVote(0)} disabled={loading}>Vote Alice</button>
      <button onClick={() => sendVote(1)} disabled={loading}>Vote Bob</button>
    </div>
  );
}

