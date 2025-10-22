# 🗳️ SilentNode FHE Voting — Setup Guide (Next.js + Zama FHE SDK)

This project is a **private voting dApp** built with **Next.js 15**, **ethers.js v6**, and **Zama FHE Relayer SDK**.  
It enables **Fully Homomorphic Encryption (FHE)** voting on the **Sepolia Testnet** using the **Zama relayer**.

---

## ⚙️ Project Structure

```
silentnode-voting/
├── frontend/
│   ├── components/
│   │   └── VotingHero.tsx
│   ├── utils/
│   │   └── polyfill-global.ts
│   ├── abi/
│   │   └── FHEPrivateVoting.json
│   ├── package.json
│   ├── tailwind.config.js
│   ├── next.config.js
│   └── vercel.json
└── README.md
```

---

## 🧩 Polyfill (Required for Browser Compatibility)

Create the file:

```
frontend/utils/polyfill-global.ts
```

with the following content:

```ts
// ✅ Must be loaded in browser context
if (typeof window !== "undefined" && typeof globalThis.global === "undefined") {
  // @ts-ignore
  globalThis.global = globalThis;
}
```

---

## 🧠 Important Dependencies

Your `package.json` inside `/frontend` should include:

```json
{
  "name": "fhevm-voting-tutorial",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build --no-lint --no-verify",
    "start": "next start"
  },
  "dependencies": {
    "@zama-fhe/relayer-sdk": "^0.1.2",
    "ethers": "^6.15.0",
    "next": "15.5.6",
    "react": "18.3.1",
    "react-dom": "18.3.1"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.1.15",
    "@types/react": "19.2.2",
    "autoprefixer": "^10.4.21",
    "eslint": "^9.38.0",
    "postcss": "^8.5.6",
    "tailwindcss": "^4.1.14"
  }
}
```

---

## 🌍 Correct Relayer URL

> ❗️Make sure the **relayer URL** uses `.cloud` — not `.ai`

✅ Correct:
```
https://relayer.testnet.zama.cloud
```

❌ Incorrect:
```
https://relayer.testnet.zama.ai
```

---

## ⚡️ Environment Variables

These should be configured **either in `vercel.json`** or directly in the **Vercel dashboard** under  
Project → Settings → Environment Variables.

| Key | Value |
|-----|--------|
| NEXT_PUBLIC_CONTRACT_ADDRESS | 0x5cF05DD28F0A1228B68806d3734641e9754cBbb1 |
| NEXT_PUBLIC_RELAYER_URL | https://relayer.testnet.zama.cloud |
| NEXT_PUBLIC_VERIFYING_CONTRACT_ADDRESS_DECRYPTION | 0xb6E160B1ff80D67Bfe90A85eE06Ce0A2613607D1 |
| NEXT_PUBLIC_VERIFYING_CONTRACT_ADDRESS_INPUT | 0x7048C39f048125eDa9d678AEbaDfB22F7900a29F |
| NEXT_PUBLIC_KMS_CONTRACT_ADDRESS | 0x1364cBBf2cDF5032C47d8226a6f6FBD2AFCDacAC |
| NEXT_PUBLIC_INPUT_VERIFIER_CONTRACT_ADDRESS | 0xbc91f3daD1A5F19F8390c400196e58073B6a0BC4 |
| NEXT_PUBLIC_ACL_CONTRACT_ADDRESS | 0x687820221192C5B662b25367F70076A37bc79b6c |
| NEXT_PUBLIC_GATEWAY_CHAIN_ID | 55815 |
| NODE_ENV | production |
| NEXT_TELEMETRY_DISABLED | 1 |

---

## 🧱 Vercel Configuration

File:  
`frontend/vercel.json`

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "version": 2,
  "buildCommand": "npm install && npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "builds": [
    { "src": "next.config.js", "use": "@vercel/next" }
  ],
  "env": {
    "NEXT_TELEMETRY_DISABLED": "1",
    "NODE_ENV": "production",
    "NEXT_PUBLIC_RELAYER_URL": "https://relayer.testnet.zama.cloud"
  }
}
```

---

## 🚀 Deploying to Vercel (from scratch)

1. Delete the old project from [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **“New Project” → “Import Git Repository”**.
3. Choose **aa2hr/silentnode-voting**.
4. Set **Root Directory** → `frontend`.
5. Add all environment variables (from table above).
6. Click **Deploy** and wait for the build to finish.
7. Your app will be available at:
   ```
   https://silentnode-voting.vercel.app/
   ```

---

## ✅ Notes

- The `global` polyfill **must load before** importing any FHE SDK.
- The `relayer` must return valid JSON from `https://relayer.testnet.zama.cloud`.
- `@zama-fhe/relayer-sdk/web` requires a browser environment and EIP-1193 provider (`window.ethereum`).

---

### 🧠 Troubleshooting

| Issue | Fix |
|-------|-----|
| `global is not defined` | Ensure `polyfill-global.ts` is imported at the top of `VotingHero.tsx`. |
| `You must provide a network URL or EIP1193 object` | Pass `network: window.ethereum` in `createInstance`. |
| `Relayer didn't respond correctly. Bad JSON.` | Make sure you’re using `https://relayer.testnet.zama.cloud` not `.ai`. |
| `Cannot redefine property: ethereum` | Caused by browser extensions like Brave Wallet; disable other wallet extensions. |

---

Made with 💙 by SilentNode Labs

# trigger redeploy
