"use client";

import { useRef, useSyncExternalStore, type RefObject } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

export type DeckCard = {
  id: string;
  name: string;
  meta: string;
  short: string;
  outcome?: string;
  problem?: string;
  stack: string[];
  cover?: string;
};

const STEP = 26; // px each card stops below the previous one
const TOP = 96; // px from the top of the viewport for the first card

// Sticky only where a card fits on screen: wide enough and tall enough.
const MD = "(min-width: 768px) and (min-height: 720px)";
function subscribeMd(onChange: () => void) {
  const mq = window.matchMedia(MD);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function Card({
  card,
  i,
  next,
  self,
  stacked,
}: {
  card: DeckCard;
  i: number;
  next?: RefObject<HTMLElement | null>;
  self: (el: HTMLElement | null) => void;
  stacked: boolean;
}) {
  // As the next card slides over this one, this one shrinks a little and dims.
  const { scrollYProgress } = useScroll({
    target: next,
    offset: ["start end", `start ${TOP + (i + 1) * STEP + 20}px`],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  // Dim with a shade inside the card rather than card opacity, which would
  // let the cards underneath show through.
  const shade = useTransform(scrollYProgress, [0, 1], [0, 0.65]);
  const still = useReducedMotion();
  const active = stacked && next && !still;

  return (
    <motion.article
      ref={self}
      style={{
        ["--deck-top" as string]: `${TOP + i * STEP}px`,
        scale: active ? scale : 1,
      }}
      className="shadow-soft relative mb-8 grid origin-top overflow-hidden rounded-3xl border border-border-strong bg-surface md:mb-10 md:min-h-[520px] md:grid-cols-[0.9fr_1.3fr] [@media(min-width:768px)_and_(min-height:720px)]:sticky [@media(min-width:768px)_and_(min-height:720px)]:top-(--deck-top)"
    >
      {active ? (
        <motion.span
          aria-hidden="true"
          style={{ opacity: shade }}
          className="pointer-events-none absolute inset-0 z-10 bg-background"
        />
      ) : null}
      <div className="flex flex-col justify-between p-7 md:p-10">
        <div>
          <p className="font-mono text-xs text-subtle">{card.meta}</p>
          <h3 className="type-title mt-4">{card.name}</h3>
          <p className="mt-4 leading-relaxed text-muted-foreground">{card.short}</p>
          {card.outcome && card.cover ? (
            <p className="mt-5 inline-flex items-center gap-2 text-sm font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              {card.outcome}
            </p>
          ) : null}
          <ul className="mt-6 flex flex-wrap gap-1.5">
            {card.stack.map((s) => (
              <li key={s} className="rounded-full border border-border-strong px-2.5 py-1 text-xs text-muted-foreground">
                {s}
              </li>
            ))}
          </ul>
        </div>
        <Link href={`/work/${card.id}`} className="group mt-8 inline-flex items-center gap-2 font-medium">
          Read the case study
          <span aria-hidden="true" className="transition-transform duration-300 ease-cine group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>

      {card.cover ? (
        <div className="relative overflow-hidden border-t border-border bg-band pl-7 pt-7 md:border-l md:border-t-0 md:pl-10 md:pt-10">
          <Image
            src={card.cover}
            alt={`${card.name} screenshot`}
            width={1440}
            height={900}
            sizes="(min-width: 768px) 60vw, 100vw"
            className="shadow-soft aspect-[16/10] w-[125%] max-w-none rounded-tl-xl border border-border-strong object-cover object-left-top"
          />
        </div>
      ) : (
        // No screenshot: the outcome carries the panel instead of an empty frame.
        <div className="flex flex-col justify-end border-t border-border bg-band p-7 md:border-l md:border-t-0 md:p-10">
          {card.outcome ? (
            <p className="serif-accent text-4xl leading-tight md:text-6xl">{card.outcome}</p>
          ) : null}
          {card.problem ? (
            <p className="mt-6 max-w-md text-muted-foreground">{card.problem}</p>
          ) : null}
        </div>
      )}
    </motion.article>
  );
}

/**
 * Featured work as a deck: each card sticks a little lower than the one
 * before, and the earlier ones shrink and dim as the next slides over. On
 * small screens the cards simply stack.
 */
export function Deck({ cards }: { cards: DeckCard[] }) {
  const refs = useRef<(HTMLElement | null)[]>([]);
  const stacked = useSyncExternalStore(subscribeMd, () => window.matchMedia(MD).matches, () => false);
  const nextRefs = cards.map((_, i) => ({
    get current() {
      return refs.current[i + 1] ?? null;
    },
  }));

  return (
    <div>
      {cards.map((card, i) => (
        <Card
          key={card.id}
          card={card}
          i={i}
          stacked={stacked}
          next={i < cards.length - 1 ? (nextRefs[i] as RefObject<HTMLElement | null>) : undefined}
          self={(el) => {
            refs.current[i] = el;
          }}
        />
      ))}
    </div>
  );
}
