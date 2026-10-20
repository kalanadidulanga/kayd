import { Fragment } from "react";

/**
 * Text whose words light up line by line as they pass up the screen (see
 * .scrub-word in globals.css). The full text is in the HTML and fully
 * visible without scroll timelines or with reduced motion.
 */
export function ScrubText({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="scrub-word">{w}</span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}
