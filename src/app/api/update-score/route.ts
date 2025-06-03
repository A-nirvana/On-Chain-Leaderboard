// app/api/relay-update-score/route.ts

import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import { abi } from "@/constants/abi";

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS!;
const RPC_URL = `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_KEY!}`;
const PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY!;

if (!RPC_URL || !PRIVATE_KEY || !CONTRACT_ADDRESS) {
  throw new Error(
    "Missing one of RPC_URL, PRIVATE_KEY, or CONTRACT_ADDRESS in environment"
  );
}

interface RelayBody {
  userId: string;
  newScore: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RelayBody;
    if (!body?.userId || !body?.newScore==undefined || !body?.newScore==null) {
      return NextResponse.json(
        { error: "Request must include both `userId` and `newScore`." },
        { status: 400 }
      );
    }

    // 2) Connect server‐side wallet to Sepolia RPC
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

    // 3) Instantiate the contract with server wallet as signer
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

    // 4) Convert newScore to BigInt (uint256) and call updateScore(userId, newScore)
    const newScoreBig = BigInt(body.newScore);
    const tx = await contract.updateScore(body.userId, newScoreBig);

    // 5) Wait for 1 confirmation (optional; remove or increase if you like)
    const receipt = await tx.wait(1);

    // 6) Return txHash and status
    return NextResponse.json(
      {
        txHash: tx.hash,
        chainId: receipt.chainId,
        status: receipt.status, // 1 = success, 0 = failure
      },
      { status: 200 }
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("⛔️ [relay-update-score] error:", err);

    if (err instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body." },
        { status: 400 }
      );
    }

    // Catch any ethers or runtime errors
    return NextResponse.json(
      { error: err.message || "Unknown server error." },
      { status: 500 }
    );
  }
}
