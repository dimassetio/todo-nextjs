import Image from "next/image";
import { Inter } from "next/font/google";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import { useEffect } from "react";
import LoadingSpinner from "@/components/loading-spinner";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is authenticated, redirect to home page
        router.push("/home");
      } else {
        // User is not authenticated, redirect to sign in page
        router.push("/signin");
      }
    });
  }, []);

  return (
    <main
      className={`flex bg-gray-900 min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <LoadingSpinner/>
    </main>
  );
}
