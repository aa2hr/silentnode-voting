import { ethers } from "ethers";

export function encodeVote(choice: string): string {
  if (!choice || typeof choice !== "string") {
    throw new Error("Invalid vote choice");
  }
  return ethers.encodeBytes32String(choice);
}

