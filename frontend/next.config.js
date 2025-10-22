/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  reactStrictMode: true,

  // Resolve lockfile warnings
  outputFileTracingRoot: path.join(__dirname, "../../"),

  // Clean build for Vercel
  typescript: {
    ignoreBuildErrors: false,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  // Environment variables for client and serverless functions
  env: {
    NEXT_PUBLIC_RELAYER_URL: process.env.NEXT_PUBLIC_RELAYER_URL,
    NEXT_PUBLIC_VERIFYING_CONTRACT_ADDRESS_DECRYPTION:
      process.env.NEXT_PUBLIC_VERIFYING_CONTRACT_ADDRESS_DECRYPTION,
    NEXT_PUBLIC_VERIFYING_CONTRACT_ADDRESS_INPUT:
      process.env.NEXT_PUBLIC_VERIFYING_CONTRACT_ADDRESS_INPUT,
    NEXT_PUBLIC_KMS_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_KMS_CONTRACT_ADDRESS,
    NEXT_PUBLIC_INPUT_VERIFIER_CONTRACT_ADDRESS:
      process.env.NEXT_PUBLIC_INPUT_VERIFIER_CONTRACT_ADDRESS,
    NEXT_PUBLIC_ACL_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_ACL_CONTRACT_ADDRESS,
    NEXT_PUBLIC_GATEWAY_CHAIN_ID: process.env.NEXT_PUBLIC_GATEWAY_CHAIN_ID,
  },

  // Allow remote images from specific domains
  images: {
    domains: ["zama.ai", "ipfs.io", "res.cloudinary.com"],
  },
};

module.exports = nextConfig;

