"use client";
import { SmoothScroll } from "./SmoothScroll";
import { HeroSection } from "./HeroSection";
import { StatementSection } from "./StatementSection";
import { KeyFactsSection } from "./KeyFactsSection";
import { CaseStudiesSection } from "./CaseStudiesSection";
import { ServicesSection } from "./ServicesSection";
import { HelixGallery } from "./HelixGallery";
import { FooterSection } from "./FooterSection";

export function HomeClone() {
  return <main className="clone-root"><SmoothScroll/><HeroSection/><StatementSection/><KeyFactsSection/><CaseStudiesSection/><ServicesSection/><HelixGallery/><FooterSection/></main>;
}
