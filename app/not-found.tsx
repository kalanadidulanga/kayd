import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Logo } from "@/components/logo";

export const metadata: Metadata = { title: "Not found", robots: { index: false } };

/** A disconnected node, and the three routes back into the network. */
export default function NotFound() {
  return (
    <main className="relative grid min-h-[100dvh] place-items-center overflow-hidden px-5 py-24 text-center">
      <div aria-hidden="true" className="glow absolute left-1/2 top-1/3 h-[480px] w-[720px] max-w-full -translate-x-1/2" />
      <div className="relative">
        <Link href="/" aria-label="KayD, home" className="text-foreground">
          <Logo className="text-4xl" />
        </Link>
        <Image
          src="/visuals/disconnected-node.webp"
          alt="A single green node with loose connectors, looking for its network"
          width={768}
          height={512}
          priority
          className="art mx-auto mt-10 h-auto w-[min(320px,80vw)]"
        />
        <h1 className="type-title mt-8">This page is not connected to anything.</h1>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">The address may be old or mistyped. These three are:</p>
        <nav aria-label="Back into the site" className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3">
          <Link href="/work" className="text-brand hover:underline">
            Work
          </Link>
          <Link href="/lab" className="text-brand hover:underline">
            Lab
          </Link>
          <Link href="/" className="text-brand hover:underline">
            Home
          </Link>
        </nav>
      </div>
    </main>
  );
}
