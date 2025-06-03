"use client";

import { usePrivy, useCreateWallet, useWallets } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { UserPill } from "@privy-io/react-auth/ui";
import UserInitialCircle from "@/components/user";
import Gamebox from "@/components/Gamebox/Gamebox";
import { useRouter } from "next/navigation";
import Loading from "./loading";

export default function UserDashboard() {
  const { ready, authenticated, user } = usePrivy();
  const { wallets } = useWallets();
  const { createWallet } = useCreateWallet();
  const router = useRouter();
  const [score, setScore] = useState<string | null>(null);
  const [loadingScore, setLoadingScore] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if(!ready)return;
    if (!authenticated){
      router.push("/sign");
      return;
    }

    const fetchScore = async () => {
      if (!user?.id) {
        toast.error("User not found.");
        return;
      }
      setLoadingScore(true);
      try {
        const res = await fetch(`/api/get-score?userId=${user.id}`);
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error || "Failed to fetch score");
        }
        setScore(data.score);
      } catch (err: any) {
        console.error("Error fetching score:", err);
        toast.error("Failed to fetch your score.");
      } finally {
        setLoadingScore(false);
      }
    };

    fetchScore();
  }, [authenticated, ready]);

  if (!ready) {
    return <Loading/>;
  }

  return (
    <main className="bg-gradient-to-br from-[#ffecd2] via-[#fcb69f] to-[#ff9a9e] min-h-screen flex items-center justify-center">
      <div className="w-[90%] h-[90%] my-6 md:my-10 space-y-6 bg-white rounded-xl shadow-lg relative px-2 py-6 md:px-8 md:py-8 flex flex-col md:flex-row gap-4">
        <div className="flex md:flex-col">
          <div className="grow" />
          <UserPill
            action={{
              type: "login",
              options: { loginMethods: ["email", "wallet"] },
            }}
            label={
              <UserInitialCircle name={user?.customMetadata?.name as string} />
            }
            ui={{
              background: "accent",
            }}
          />
        </div>
        <div className="flex-grow flex flex-col px-8 py-2">
          <div className="text-3xl font-bold">
            Welcome, {user?.customMetadata?.name || "User"}!
          </div>
          <div className="text-sm text-gray-500">
            {user?.email?.address || "No email available"}
          </div>
          <div className="space-y-2 mt-10">
            <div className="text-gray-700 font-medium">
              Your Highest Score:{" "}
              <span className="text-lg">
                {loadingScore ? "Loading…" : score ?? "No score yet"}
              </span>
            </div>
            <button
              onClick={() => {
                router.push("/leaderboard");
              }}
              className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-[#f9f586] to-[#d4fc79] text-black hover:scale-105 transition"
            >
              🏆 View Leaderboard
            </button>
            {wallets.length == 0 && (
              <div className="p-6">
                <p className="mb-4 text-gray-600">
                  No embedded Ethereum wallet found for your account.
                  <br />
                  Create one to interact with the chain and earn rewards.
                </p>
                <button
                  onClick={async () => {
                    setCreating(true);
                    try {
                      const w = await createWallet();
                      toast.success(`Ethereum wallet created: ${w.address}`);
                    } catch (err: any) {
                      console.error("createWallet error:", err);
                      toast.error("Failed to create wallet");
                    } finally {
                      setCreating(false);
                    }
                  }}
                  disabled={creating}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  {creating ? "Creating Wallet…" : "Create Embedded Wallet"}
                </button>
              </div>
            )}
            <p className="text-sm md:text-lg font-semibold">
              You can get a score by playing the games below! Rank up on the
              leaderboard and earn rewards.
            </p>
            <Gamebox />
          </div>
        </div>
      </div>
    </main>
  );
}
