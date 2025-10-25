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
      alert("لطفاً گزینه خود را وارد کنید.");
      return;
    }

    if (!fhe) {
      alert("FHE SDK هنوز آماده نیست!");
      return;
    }

    try {
      // 🔒 رمزنگاری رأی با FHE SDK
      const encryptedVote = fhe.encrypt(choice, "uint8");
      console.log("🧩 رأی رمزنگاری‌شده:", encryptedVote);

      // 📨 ارسال رأی به قرارداد هوشمند
      const tx = await contract.vote(encryptedVote);
      await tx.wait();

      alert("✅ رأی شما با موفقیت ارسال شد!");
      setChoice("");
    } catch (err) {
      console.error("❌ خطا در ارسال رأی:", err);
      alert("ارسال رأی موفقیت‌آمیز نبود.");
    }
  };

  return (
    <div className="w-full max-w-md flex flex-col gap-4">
      <input
        type="text"
        placeholder="نام گزینه‌ی خود را وارد کنید (مثلاً CandidateA)"
        value={choice}
        onChange={(e) => setChoice(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleVote}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
      >
        ثبت رأی 🗳
      </button>
    </div>
  );
}

