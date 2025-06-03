import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import { abi } from "@/constants/abi"; // Make sure this path is correct

// Replace with your deployed contract address
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS!;
const RPC_URL = `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_KEY!}`;

// Sepolia RPC provider (e.g., from Alchemy or Infura)
const provider = new ethers.JsonRpcProvider(RPC_URL);

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Invalid or missing userId" }, { status: 400 });
  }

  try {
    console.log(CONTRACT_ADDRESS, RPC_URL);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
    const score: bigint = await contract.getScore(userId);
    return NextResponse.json({ userId, score: score.toString() });
  } catch (error: unknown) {
    console.error("Failed to fetch score:", error);
    return NextResponse.json({ error: "Failed to fetch score" }, { status: 500 });
  }
}
