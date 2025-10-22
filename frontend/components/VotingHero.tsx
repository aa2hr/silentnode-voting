"use client";

import "../utils/polyfill-global";
import React, { useState, useCallback } from "react";
import { ethers, Contract } from "ethers";
import contractABI from "../abi/FHEPrivateVoting.json";

// ⚙️ Configuration: Contract + Relayer
const CONFIG = {
  contractAddress:
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
    "0x5cF05DD28F0A1228B68806d3734641e9754cBbb1",
  sepolia: {
    chainId: 11155111,
    relayerUrl:
      process.env.NEXT_PUBLIC_RELAYER_URL ||
      "https://relayer.testnet.zama.cloud",
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
    gatewayChainId: parseInt(
      process.env.NEXT_PUBLIC_GATEWAY_CHAIN_ID || "55815",
      10
    ),
  },
};

// ✅ Safe Ethereum provider getter
const getSafeEthereumProvider = (): any => {
  if (typeof window === "undefined") return null;
  const { ethereum } = window as any;
  const candidates = ethereum?.providers || [];
  return Array.isArray(candidates) && candidates.length > 0
    ? candidates.find((p: any) => p.isMetaMask) || candidates[0]
    : ethereum || null;
};

const VotingHero: React.FC = () => {
  const [account, setAccount] = useState<string>("");
  const [contract, setContract] = useState<Contract | null>(null);
  const [fhe, setFhe] = useState<any>(null);
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // 🌐 Initialize FHE & wallet with fallback
  const initFHE = useCallback(async () => {
    setLoading(true);
    setStatus("🔄 Connecting to wallet...");

    try {
      const ethProvider = getSafeEthereumProvider();
      if (!ethProvider)
        throw new Error("No valid Ethereum provider found. Please install MetaMask.");

      await ethProvider.request({ method: "eth_requestAccounts" });
      const ethersProvider = new ethers.BrowserProvider(ethProvider);
      const signer = await ethersProvider.getSigner();

      // ⚙️ Attempt to create FHE instance (fallback to demo mode if relayer offline)
      let fheInstance = null;
      try {
        const { createInstance } = await import("@zama-fhe/relayer-sdk/web");
        fheInstance = await createInstance({
          ...CONFIG.sepolia,
          network: ethProvider,
        });
        console.log("✅ FHE instance initialized:", fheInstance);
      } catch (err) {
        console.warn("⚠️ Relayer unavailable, switching to demo mode:", err);
      }

      // Connect to contract
      const votingContract = new ethers.Contract(
        CONFIG.contractAddress,
        contractABI,
        signer
      );
      const acc = await signer.getAddress();

      setFhe(fheInstance);
      setContract(votingContract);
      setAccount(acc);

      if (fheInstance)
        setStatus("✅ Connected & FHE initialized successfully");
      else
        setStatus("⚠️ Relayer unavailable — running in demo mode");
    } catch (error: any) {
      console.error("❌ Initialization error:", error);
      setStatus(`Error: ${error.message || "Initialization failed"}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // 🗳️ Cast encrypted vote (or simulate if FHE unavailable)
  const castVote = useCallback(
    async (optionIndex: number) => {
      if (!contract) {
        alert("Please connect wallet first.");
        return;
      }

      try {
        if (!fhe) {
          setStatus("🧩 Demo mode: vote simulated (FHE disabled)");
          return;
        }

        setStatus("🔐 Encrypting vote...");
        const encryptFn =
          fhe.encrypt ||
          fhe.encrypt8 ||
          fhe.encrypt64 ||
          (() => {
            throw new Error("No supported encryption method found");
          });

        const encryptedChoice = await encryptFn(optionIndex);
        setStatus("📤 Submitting vote...");
        const tx = await contract.voteFHE(encryptedChoice, "0x");
        await tx.wait();

        setStatus("✅ Vote submitted successfully!");
      } catch (error: any) {
        console.error("❌ Vote error:", error);
        setStatus(`Error: ${error.message || "Vote failed"}`);
      }
    },
    [fhe, contract]
  );

  // 🎨 UI Rendering
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-br from-gray-950 to-gray-800 text-white">
      <h1 className="text-4xl font-extrabold mb-6 tracking-tight text-center">
        🗳️ SilentNode Private Voting
      </h1>

      {!account ? (
        <button
          onClick={initFHE}
          disabled={loading}
          className={`px-6 py-3 rounded-lg font-semibold transition duration-200 transform hover:scale-105 shadow-md ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "🔄 Connecting..." : "🔌 Connect Wallet & Initialize"}
        </button>
      ) : (
        <div className="flex flex-col items-center gap-6">
          <p className="text-sm bg-green-700 px-3 py-1 rounded-full font-mono">
            ✅ Connected: {account.slice(0, 6)}...{account.slice(-4)}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "🟢 Vote Alice", index: 0, color: "bg-green-600 hover:bg-green-500" },
              { label: "🟡 Vote Bob", index: 1, color: "bg-yellow-600 hover:bg-yellow-500" },
              { label: "🔴 Vote Charlie", index: 2, color: "bg-red-600 hover:bg-red-500" },
            ].map(({ label, index, color }) => (
              <button
                key={label}
                onClick={() => castVote(index)}
                className={`px-6 py-3 rounded-lg font-medium transition duration-200 transform hover:scale-105 shadow-md ${color}`}
              >
                {label}
              </button>
            ))}
          </div>

          {status && (
            <p className="mt-4 text-sm text-gray-300 font-mono animate-fade-in">
              {status}
            </p>
          )}
        </div>
      )}
    </section>
  );
};

export default VotingHero;

