"use client";

import { useState, useEffect } from "react";
import {
  useLogin,
  useLoginWithEmail,
  useLoginWithOAuth,
  usePrivy,
} from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/otp";
import Image from "next/image";
import Loading from "../loading";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");

  const { sendCode, loginWithCode } = useLoginWithEmail();
  const { state, loading, initOAuth } = useLoginWithOAuth();
  const { login } = useLogin();
  const { authenticated, ready, user } = usePrivy();
  const router = useRouter();
  const [saved, setSaved] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      await initOAuth({ provider: "google" });
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Error logging in with Google");
    }
  };

  const handleGitHubLogin = async () => {
    try {
      await initOAuth({ provider: "github" });
    } catch (error) {
      console.error("GitHub login error:", error);
      toast.error("Error logging in with GitHub");
    }
  };

  const handleSendCode = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    setIsLoading(true);
    try {
      await sendCode({ email });
      setCodeSent(true);
    } catch (err) {
      toast.error("Error sending code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (code.length !== 6) {
      toast.error("Enter 6-digit code");
      return;
    }
    setIsLoading(true);
    try {
      await loginWithCode({ code });
    } catch (err) {
      toast.error("Invalid code");
    } finally {
      setIsLoading(false);
    }
  };

  const maskVariants = {
    hidden: { x: "0%" },
    show: {
      x: "100%",
      transition: { duration: 1.2, ease: "easeInOut" },
    },
  };

  // 2) Variants for the text fade/slide
  const textVariants = {
    hidden: { y: 5, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut", delay: 0.3 },
    },
  };

  useEffect(() => {
    if (ready && authenticated && (user?.customMetadata?.name || saved)) {
      toast.success(`Welcome, ${user?.customMetadata?.name}!`);
      router.push("/");
    }
  }, [authenticated, ready, router, user, saved]);

  if (!ready) return <Loading/>;

  return (
    <div className="min-h-screen flex flex-col-reverse lg:flex-row items-center justify-center bg-gradient-to-br from-[#a1c4fd] via-[#c2e9fb] to-[#fbc2eb]">
      <div className="lg:h-screen md:grow flex  bg-gradient-to-br from-[#ffecd2] via-[#fcb69f] to-[#ff9a9e] items-center md:pl-10">
        <div className="w-full max-w-screen lg:w-4/5 lg:h-4/5 bg-white  rounded-xl shadow-lg relative p-8 flex flex-col overflow-hidden">
          <motion.div
            initial="hidden"
            animate="show"
            className="relative lg:inline-block overflow-hidden hidden"
          >
            <motion.h1
              variants={textVariants}
              className="text-5xl font-semibold leading-tight"
            >
              Proof of Play
              <br />
              Powered by Chain.
            </motion.h1>
            <motion.div
              variants={maskVariants}
              className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent to-white"
            />
          </motion.div>
          <p className="text-gray-600 mt-4">
            Join the future of gaming with On Chain. Connect your wallet and
            start earning rewards today!
          </p>
          <div className="grow relative z-0">
            <Image
              src="/trophy.svg"
              alt="Trophy"
              width={300}
              height={300}
              className={`
                absolute -z-10 top-4 aspect-square w-96 object-contain -rotate-[30deg] hidden lg:flex
                [mask-image:linear-gradient(black,#11111160,transparent)]
                [-webkit-mask-image:linear-gradient(black,#11111160,transparent)]
              `}
              priority
            />
          </div>
          <p className="text-gray-800 mb-8">
            Earn your score. Own your legacy.
            <br /> This platform records your achievements on-chain —
            permanently, transparently, and securely. <br />
            Log in to track your progress, climb the leaderboard, and let your
            performance speak for itself.
            <br /> 🚀 Built for gamers. Backed by blockchain.
          </p>
        </div>
      </div>
      <div className="bg-white shadow-xl relative md:right-[10%] rounded-xl w-sm p-6 space-y-6 overflow-hidden max-w-screen">
        <h2 className="text-2xl font-semibold text-center">
          Welcome to On Chain 🏆
        </h2>

        <div className="w-full h-max space-y-6">
          <div className="space-y-3">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded px-4 py-2 hover:bg-gray-100 transition"
            >
              <img src="/google.svg" alt="Goole" className="w-5 h-5" />
              Continue with Google
            </button>

            <button
              onClick={handleGitHubLogin}
              className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded px-4 py-2 hover:bg-gray-100 transition"
            >
              <img src="/github.svg" alt="GIthub" className="w-5 h-5" />
              Continue with Github
            </button>
            <button
              onClick={() => login({ loginMethods: ["wallet"] })}
              className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded px-4 py-2 hover:bg-gray-100 transition"
            >
              <img src="/wallet.svg" alt="GIthub" className="w-5 h-5" />
              Continue with a Wallet
            </button>
          </div>

          <div className="relative text-center text-gray-500 text-sm">
            <span className="absolute inset-x-0 top-1/2 border-t border-gray-200"></span>
            <span className="relative bg-white px-2">
              or continue with email
            </span>
          </div>

          {!codeSent ? (
            <>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full border border-gray-300 p-2 rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                onClick={handleSendCode}
                className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Code"}
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Your name"
                className="w-full border border-gray-300 p-2 rounded"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <div className="text-center text-sm text-gray-600">
                Enter the 6-digit code sent to your email
              </div>
              <div className="flex justify-center gap-1">
                <InputOTP
                  value={code}
                  onChange={(val) => setCode(val)}
                  maxLength={6}
                >
                  {[...Array(6)].map((_, i) => (
                    <InputOTPGroup key={i}>
                      <InputOTPSlot index={i} />
                    </InputOTPGroup>
                  ))}
                </InputOTP>
              </div>
              <button
                onClick={handleVerifyCode}
                className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Verify Code"}
              </button>
            </>
          )}
        </div>
        {authenticated && !user?.customMetadata?.name && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="h-full bg-white rounded-xl absolute inset-0 z-10 flex flex-col justify-center p-6 items-center"
            style={{ boxShadow: "0 0 40px 0 rgba(0,0,0,0.08)" }}
          >
            <div className="mt-4"></div>
            <label
              htmlFor="displayName"
              className="block text-xl text-gray-700 mb-4 font-semibold"
            >
              What should we call you?
            </label>
            <input
              id="displayName"
              type="text"
              placeholder="Your display name"
              className="w-full border border-gray-300 p-2 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="off"
            />
            <button
              onClick={async () => {
                const trimmed = name.trim();
                if (!trimmed) {
                  toast.error("Please enter a display name");
                  return;
                }

                try {
                  const res = await fetch("/api/name", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      userId: user!.id,
                      name: trimmed,
                    }),
                  });

                  const data = await res.json();
                  if (!res.ok) {
                    throw new Error(data.error || "Failed to update name");
                  }

                  setSaved(true);
                  toast.success("Your display name has been saved!");
                } catch (err: any) {
                  console.error("Error updating display name:", err);
                  toast.error(err.message || "Unable to save name");
                }
              }}
              className="mt-4 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
            >
              Submit
            </button>
          </motion.div>
        )}
      </div>
      <motion.div
            initial="hidden"
            animate="show"
            className="relative py-4 inline-block overflow-hidden lg:hidden"
          >
            <motion.h1
              variants={textVariants}
              className="text-3xl font-semibold leading-tight"
            >
              Proof of Play
              <br />
              Powered by Chain.
            </motion.h1>
            <motion.div
              variants={maskVariants}
              className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent to-white"
            />
          </motion.div>
    </div>
  );
}
