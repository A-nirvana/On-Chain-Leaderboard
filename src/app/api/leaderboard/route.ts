export const runtime = "nodejs"; // ✅ Force Node.js runtime

import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import { abi } from "@/constants/abi";

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS!;
const RPC_URL = `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_KEY!}`;
const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID!;
const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET!;

if (!RPC_URL || !CONTRACT_ADDRESS || !PRIVY_APP_ID || !PRIVY_APP_SECRET) {
  throw new Error("Missing required environment variables.");
}

async function fetchAllPrivyUsers(): Promise<any[]> {
  const allUsers: any[] = [];
  let cursor: string | null = null;

  // Privy’s GET /users endpoint paginates with `cursor` query param.
  // Documentation: https://docs.privy.io/api-reference/users/get
  do {
    const url = new URL("https://auth.privy.io/api/v1/users");
    url.searchParams.set("limit", "100");
    if (cursor) url.searchParams.set("cursor", cursor);

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "privy-app-id": PRIVY_APP_ID,
        Authorization:
          "Basic " +
          Buffer.from(`${PRIVY_APP_ID}:${PRIVY_APP_SECRET}`).toString("base64"),
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Privy GET /users failed: ${res.status} ${text}`);
    }

    const body = await res.json();
    if (!Array.isArray(body.data)) {
      throw new Error("Unexpected Privy response shape");
    }

    allUsers.push(...body.data);
    cursor = body.cursor || null;
  } while (cursor);

  return allUsers;
}

export async function GET(_req: NextRequest) {
  try {
    // 1) Connect to Sepolia RPC
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);

    // 2) Fetch [userIds, scores[]] from contract
    const [userIds, scoresBig]: [string[], bigint[]] = await contract.getLeaderboard();
    const scores = scoresBig.map((s) => s.toString());

    // 3) Fetch all Privy users via REST
    const users = await fetchAllPrivyUsers();
    // Build a map of DID → user object
    const userMap = new Map(users.map((u) => [u.id, u]));

    // 4) Merge on-chain data with Privy user data
    const leaderboard = userIds.map((userId, idx) => ({
      userId,
      score: scores[idx],
      user: userMap.get(userId) || null,
    }));

    return NextResponse.json({ leaderboard }, { status: 200 });
  } catch (err: any) {
    console.error("⛔️ [get-leaderboard] error:", err);
    return NextResponse.json(
      { error: err.message || "Unknown server error." },
      { status: 500 }
    );
  }
}
