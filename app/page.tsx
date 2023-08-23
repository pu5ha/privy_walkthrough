"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

export default function Home() {
  const { login, ready, authenticated } = usePrivy();
  const router = useRouter();

  if (!ready) return <></>;

  if (ready && authenticated) router.push("/loggedin");

  return (
    <main className="p-8 text-center">
      <h1 className="text-2xl font-semibold mb-4">
        Privy Embedded Wallet Demo
      </h1>
      <button
        onClick={login}
        className="px-4 py-2 rounded text-white bg-blue-500 hover:bg-blue-600"
      >
        Log in
      </button>
    </main>
  );
}
