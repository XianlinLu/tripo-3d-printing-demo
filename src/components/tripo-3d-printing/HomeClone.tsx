"use client";
import { SmoothScroll } from "./SmoothScroll";
import { HeroSection } from "./HeroSection";
import { StatementSection } from "./StatementSection";
import { KeyFactsSection } from "./KeyFactsSection";
import { TrionnPostKeyFacts } from "./trionn-post-keyfacts/TrionnPostKeyFacts";

export function HomeClone() {
  return <main className="clone-root"><SmoothScroll/><HeroSection/><StatementSection/><KeyFactsSection/><TrionnPostKeyFacts/></main>;
}
