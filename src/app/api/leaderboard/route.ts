export const runtime = "nodejs"; // ✅ Force Node.js runtime

import { NextResponse } from "next/server";
import { ethers } from "ethers";
import { abi } from "@/constants/abi";

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS!;
const RPC_URL = `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_KEY!}`;
const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID!;
const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET!;

if (!RPC_URL || !CONTRACT_ADDRESS || !PRIVY_APP_ID || !PRIVY_APP_SECRET) {
  throw new Error("Missing required environment variables.");
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchAllPrivyUsers(): Promise<any[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allUsers: any[] = [];
  let cursor: string | null = null;

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

export async function GET() {
  try {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);

    const [userIds, scoresBig]: [string[], bigint[]] = await contract.getLeaderboard();
    const scores = scoresBig.map((s) => s.toString());

    const users = await fetchAllPrivyUsers();
    const userMap = new Map(users.map((u) => [u.id, u]));

    const leaderboard = userIds.map((userId, idx) => ({
      userId,
      score: scores[idx],
      user: userMap.get(userId) || null,
    }));

    return NextResponse.json({ leaderboard }, { status: 200 });
  } catch (err: unknown) {
    console.error("⛔️ [get-leaderboard] error:", err);
    return NextResponse.json(
      { error:"Unknown server error." },
      { status: 500 }
    );
  }
}
