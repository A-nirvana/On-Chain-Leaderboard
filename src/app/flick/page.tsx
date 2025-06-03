"use client";

import { usePrivy } from "@privy-io/react-auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import Loading from "../loading";

const CoinToss: React.FC = () => {
  const { user, ready, authenticated } = usePrivy();
  const [prediction, setPrediction] = useState<"heads" | "tails">("heads");
  const [result, setResult] = useState<"" | "heads" | "tails">("");
  const [score, setScore] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  const [help, setHelp] = useState(false);
  const [highestScore, setHighestScore] = useState<number>(0);
  const [loadingScore, setLoadingScore] = useState(false);
  const [updating, setUpdating] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/sign");
    }
  }, [ready, authenticated]);

  const coinToss = () => {
    const flipResult = Math.random() < 0.5 ? "heads" : "tails";
    setResult(flipResult);

    const points = Math.floor(Math.random() * 101);

    if (prediction === flipResult) {
      setScore((prev) => prev + points);
      setMessage(`🎉 You guessed correctly! You earned ${points} points.`);
    } else {
      setScore((prev) => prev - points);
      setMessage(`😞 Wrong guess. You lost ${points} points.`);
    }
  };

  useEffect(() => {
    if (!authenticated) return;

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
        setHighestScore(data.score);
      } catch (err: unknown) {
        console.error("Error fetching score:", err);
        toast.error("Failed to fetch your score.");
      } finally {
        setLoadingScore(false);
      }
    };

    fetchScore();
  }, [authenticated]);

  const handleUpdateScore = async () => {
    if (!score) {
      toast.error("Please enter a new score.");
      return;
    }
    if (!user?.id) {
      toast.error("User not found.");
      return;
    }

    setUpdating(true);
    try {
      const res = await fetch("/api/update-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          newScore: score,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Update failed");
      }
      if (data.updatedScore) {
        setHighestScore(data.updatedScore.toString());
      } else {
        const fresh = await fetch(`/api/get-score?userId=${user.id}`);
        const freshData = await fresh.json();
        if (fresh.ok) setScore(freshData.score);
      }
      toast.success("Score updated successfully!");
      setScore(0);
    } catch (err: unknown) {
      console.error("Error updating score:", err);
      toast.error("Could not update score.");
    } finally {
      setUpdating(false);
    }
  };

  if (!ready) return <Loading/>;

  return (
    <main className="relative z-0 min-h-screen w-screen bg-gradient-to-br from-[#d4fc79] via-[#96e6a1] to-[#f9f586] flex md:items-center justify-center">
      <div className="relative z-20 w-screen min-w-xs md:w-full md:max-w-md mt-10 md:mt-0 p-6 bg-white rounded-2xl shadow-lg space-y-6">
        <div className="border-b pb-4">
          <h2 className="text-xl font-semibold mb-2">How to Play:</h2>
          <p className="text-gray-700">
            • You make a prediction <br />• If correct, you earn points <br />•
            If wrong, you lose points <br />
          </p>
        </div>

        <div className="text-center">
          <p className="text-lg">
            Your Current Score: <span className="font-bold">{score}</span>
            <br/>
            Your Highest Score:{" "}
            <span className="font-bold">{loadingScore?"loading...":highestScore}</span>
          </p>
        </div>
        <fieldset className="space-y-2">
          <legend className="text-md font-medium">Make Your Prediction:</legend>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="prediction"
                value="heads"
                checked={prediction === "heads"}
                onChange={() => setPrediction("heads")}
                className="form-radio h-5 w-5 text-blue-600"
              />
              <span>Heads</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="prediction"
                value="tails"
                checked={prediction === "tails"}
                onChange={() => setPrediction("tails")}
                className="form-radio h-5 w-5 text-blue-600"
              />
              <span>Tails</span>
            </label>
          </div>
        </fieldset>

        <div className="text-center">
          <button
            onClick={coinToss}
            id="coin"
            className={`${result} min-w-[100px] w-[10vw] rounded-full aspect-square border-4 border-gray-300 ${
              result ? "" : "animate-pulse"
            }`}
            key={Date.now()}
          >
            <div className="bg-[url('/bitcoin.png')] z-[100] bg-cover"></div>
            <div className="bg-[url('/dollar.png')] rotate-y-180 bg-cover"></div>
          </button>
        </div>

        {result && (
          <div className="text-center space-y-2">
            <p className="text-lg">
              Result: <span className="font-bold capitalize">{result}</span>
            </p>
            <p
              className={`${
                message.startsWith("🎉") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          </div>
        )}
      </div>
      <div
        className={`relative hidden z-10 md:flex bg-white rounded-r-2xl p-6 flex-col space-y-3 transition-all duration-300 ease-in ${
          help ? "" : "right-[150px]"
        }`}
      >
        <button
          type="button"
          className="absolute rotate-90 top-8 -right-12 transform -translate-y-1/2 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center px-3 py-2 transition-all"
          onClick={() => setHelp((h) => !h)}
          aria-label="Guide"
        >
          <span className="mr-2">↑</span>
          guide
        </button>
        <Image src="/dollar.png" alt="Dollar" width={100} height={100} />
        <p>This is Heads</p>
        <Image src="/bitcoin.png" alt="Bitcoin" width={100} height={100} />
        <p>This is Tails</p>
      </div>
    <AnimatePresence>
        {score>highestScore && (
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="fixed bottom-8 md:right-8 z-50 bg-gradient-to-br from-green-400 via-yellow-200 to-yellow-100 shadow-2xl rounded-2xl px-8 py-6 flex items-center space-x-4 border-2 border-green-300"
            >
                <Image src="/trophy.svg" alt="Trophy" width={48} height={48} />
                <div>
                    <p className="text-lg font-bold text-green-700">New High Score!</p>
                    <p className="text-2xl font-extrabold text-yellow-700">{score}</p>
                </div>
                <button
                    onClick={handleUpdateScore}
                    disabled={updating}
                    className={`ml-auto px-4 py-2 rounded-lg text-white font-semibold transition-colors ${
                        updating ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                    }`}
                >
                    {updating ? "Updating..." : "Lock Score"}
                </button>
            </motion.div>
        )}
    </AnimatePresence>
    </main>
  );
};

export default CoinToss;
