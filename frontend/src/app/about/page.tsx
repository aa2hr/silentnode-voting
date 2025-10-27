// frontend/src/app/about/page.tsx
import React from "react";

export const metadata = {
  title: "About | SilentNode Private Voting",
  description:
    "Learn more about SilentNode Private Voting — a privacy-first encrypted voting dApp built with Zama’s FHE SDK.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center justify-center px-6 py-16">
      <div className="max-w-3xl text-center space-y-8">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          🛡️ SilentNode Private Voting
        </h1>

        <p className="text-lg text-gray-300 leading-relaxed">
          <strong>SilentNode Private Voting</strong> is a browser-based
          confidential voting dApp built using <strong>Zama’s FHE SDK</strong>.
          It enables encrypted vote submission directly from the user’s wallet,
          ensuring privacy without compromising verifiability.
        </p>

        <p className="text-lg text-gray-300 leading-relaxed">
          The onboarding flow is modular, reproducible, and designed for
          contributor clarity — with live wallet status indicators, disconnect
          features, and granular error handling.
        </p>

        <p className="text-lg text-gray-300 leading-relaxed">
          This project reflects <strong>SilentNode’s philosophy</strong>: quiet
          strength, privacy-first architecture, and transparent technical
          standards. Built for the <strong>FHE community</strong>, it sets a
          foundation for secure governance tools that are easy to audit, extend,
          and trust.
        </p>

        <p className="text-md text-gray-400 italic">
          “Silent strength. Transparent trust.”
        </p>

        <div className="mt-8">
          <a
            href="/"
            className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-md transition"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </main>
  );
}

