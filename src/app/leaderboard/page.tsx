"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Loading from "../loading";

interface LeaderboardEntry {
  userId: string;
  score: string;
  user: {
    id: string;
    email?: { address: string };
    wallet?: { address: string };
    custom_metadata?: { name: string };
  };
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = usePrivy();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("/api/leaderboard");
        if (!res.ok) throw new Error("Failed to load leaderboard");
        const data = await res.json();
        setEntries(data.leaderboard);
      } catch (err: any) {
        toast.error("Error fetching leaderboard");
        console.error("Leaderboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if(entries.length===0) return <Loading/>

  return (
    <main className="w-full bg-gradient-to-br from-[#a1c4fd] via-[#c2e9fb] to-[#fbc2eb] min-h-screen py-10">
      <div className="p-8 max-w-5xl mx-auto relative  bg-white border border-gray-200 rounded-lg shadow-md flex flex-col lg:flex-row justify-center gap-6">
        <div className="lg:min-w-lg">
          <div className="flex flex-wrap space-y-4 items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">🏆 Leaderboard</h1>
            <button
              onClick={() => {
                router.push("/flick")
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              Play Games to Rank Up
            </button>
          </div>

          {/* Leaderboard Table */}
          {loading ? (
            <p>Loading leaderboard...</p>
          ) : entries.length === 0 ? (
            <p>No entries yet.</p>
          ) : (
            <table className="w-full border border-gray-300 rounded overflow-hidden">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-3">Rank</th>
                  <th className="p-3">User</th>
                  <th className="p-3">Score</th>
                </tr>
              </thead>
              <tbody>
                {entries
                  .sort((a, b) => Number(b.score) - Number(a.score))
                  .map((entry, idx) => {
                    const username =
                      entry.user?.custom_metadata?.name ||
                      entry.user?.email?.address ||
                      entry.user?.wallet?.address ||
                      entry.userId;
                    const isCurrentUser = entry.userId === user?.id;
                    return (
                      <tr
                        key={entry.userId}
                        className={
                          isCurrentUser
                            ? "bg-blue-100"
                            : idx % 2 === 0
                            ? "bg-white"
                            : "bg-gray-50"
                        }
                      >
                        <td className="p-3 font-medium">{idx + 1}</td>
                        <td className="p-3 truncate">
                          {username}
                          <span className="ml-2 text-gray-400 text-xs">
                            (
                            {(() => {
                              const id = entry.userId.replace(
                                /^did:privy:/,
                                ""
                              );
                              return id.length > 4 ? id.slice(0, 4) + "…" : id;
                            })()}
                            )
                          </span>
                        </td>
                        <td className="p-3">{entry.score}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          )}
        </div>

        {/* Rank-Based Rewards Section */}
        {!loading && entries.length > 0 && (
          <div className="mt-10 text-center">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              🎁 Rank-Based Rewards
            </h2>
            <div className="space-y-6 text-gray-700">
              {/* Rank 1 */}
              <div>
                <h3 className="text-xl font-bold text-yellow-500">🥇 Rank 1</h3>
                <p className="text-sm text-gray-600 ml-4">
                  Legendary 1/1 <strong>NFT Trophy</strong> with custom
                  animation and permanent leaderboard glory. Plus whitelist
                  access to exclusive games.
                </p>
              </div>
              {/* Ranks 2–3 */}
              <div>
                <h3 className="text-xl font-bold text-gray-600">
                  🥈 Ranks 2–3
                </h3>
                <p className="text-sm text-gray-600 ml-4">
                  Epic <strong>NFT Badge</strong> showcasing your elite
                  placement. Grants a +5% bonus to your score in the next
                  season.
                </p>
              </div>
              {/* Ranks 4–10 */}
              <div>
                <h3 className="text-xl font-bold text-orange-500">
                  🥉 Ranks 4–10
                </h3>
                <p className="text-sm text-gray-600 ml-4">
                  Rare <strong>NFT Avatar Frame</strong> to style your profile
                  on the leaderboard and stand out from the crowd.
                </p>
              </div>
              {/* Ranks 11–50 */}
              <div>
                <h3 className="text-xl font-bold text-green-600">
                  🎖️ Ranks 11–50
                </h3>
                <p className="text-sm text-gray-600 ml-4">
                  Uncommon <strong>NFT Achievement Card</strong> marking your
                  season milestone. Collectible and forgeable for future
                  upgrades.
                </p>
              </div>
              {/* All Players */}
              <div>
                <h3 className="text-xl font-bold text-indigo-500">
                  🎲 All Players (with score)
                </h3>
                <p className="text-sm text-gray-600 ml-4">
                  <strong>Proof of Play NFT</strong> collectible that evolves
                  each season and unlocks special rewards, airdrops, and VIP
                  access.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
