export const runtime = "nodejs"; // Ensure Node.js runtime

import { NextRequest, NextResponse } from "next/server";

// Environment variables (set these in .env.local)
const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID!;
const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET!;

if (!PRIVY_APP_ID || !PRIVY_APP_SECRET) {
  throw new Error("Missing PRIVY_APP_ID or PRIVY_APP_SECRET in environment");
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { userId?: string; name?: string };
    const { userId, name } = body;

    if (!userId || typeof userId !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid `userId` in request body." },
        { status: 400 }
      );
    }
    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid `name` in request body." },
        { status: 400 }
      );
    }

    // 1) Update Privy custom_metadata
    const privyUrl = `https://auth.privy.io/api/v1/users/${encodeURIComponent(
      userId
    )}/custom_metadata`;

    const basicAuth = Buffer.from(
      `${PRIVY_APP_ID}:${PRIVY_APP_SECRET}`
    ).toString("base64");

    const privyRes = await fetch(privyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "privy-app-id": PRIVY_APP_ID,
        Authorization: `Basic ${basicAuth}`,
      },
      body: JSON.stringify({ custom_metadata: { name } }),
    });

    if (!privyRes.ok) {
      const text = await privyRes.text();
      return NextResponse.json(
        { error: `Privy API error: ${privyRes.status} ${text}` },
        { status: privyRes.status }
      );
    }

    const updatedUser = await privyRes.json();

    // 2) Immediately set newScore = 0 on-chain via our internal /api/update-score
    const updateScoreUrl = new URL("/api/update-score", req.url).toString();
    const updateScoreRes = await fetch(updateScoreUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        newScore: 0,
      }),
    });

    if (!updateScoreRes.ok) {
      const text = await updateScoreRes.text();
      console.error(
        `[update-score] failed: ${updateScoreRes.status} ${text}`
      );
      // We do not early-return here, since we already updated custom_metadata.
      // But clients can inspect this error if needed.
    }

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (err: any) {
    console.error("[update-username] error:", err);
    return NextResponse.json(
      { error: err.message || "Unknown server error." },
      { status: 500 }
    );
  }
}
