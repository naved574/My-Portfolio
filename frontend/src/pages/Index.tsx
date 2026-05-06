import { lazy } from "react";
import Navbar from "@/components/layout/Navbar";
import ScrollProgress from "@/components/common/ScrollProgress";
import BackToTop from "@/components/common/BackToTop";
const Hero = lazy(() => import("@/pages/Home/Hero"));
const About = lazy(() => import("@/pages/About/About"));
const Projects = lazy(() => import("@/pages/Projects/Projects"));
const Contact = lazy(() => import("@/pages/contact/Contact"));
import Animation from "@/pages/Home/Animation";
import Footer from "@/components/layout/Footer";

export default function Index() {
  return (
    <div className="min-h-screen bg-[color:var(--color-bg)] text-[color:var(--color-text)]">
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <Animation />
        <About />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
