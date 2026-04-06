"use client";

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen w-full bg-(--txt-clr) flex items-center justify-center px-6">
      <div className="flex flex-col items-center text-center max-w-md w-full gap-6">

        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <Image
            src="/brand-logo.png"
            alt="Swiftly IMS"
            width={72}
            height={72}
            loading="eager"
            className="object-contain"
            style={{ width: 'auto', height: '72px' }}
          />
          <div>
            <h1
              className="text-2xl sm:text-3xl font-bold text-(--pry-clr)"
              style={{ fontFamily: "var(--pry-ff)" }}
            >
              Welcome to Swiftly IMS
            </h1>
            <p
              className="text-sm sm:text-base mt-1.5 text-(--sec-clr)"
              style={{ fontFamily: "var(--sec-ff)" }}
            >
              Your one-stop solution for efficient inventory management.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            onClick={() => router.push("/auth")}
            className="w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-semibold bg-(--acc-clr) border border-(--acc-clr) text-(--pry-clr) hover:bg-(--prof-clr) transition-colors cursor-pointer"
            style={{ fontFamily: "var(--sec-ff)" }}
          >
            Login
          </button>
        </div>

      </div>
    </main>
  );
}