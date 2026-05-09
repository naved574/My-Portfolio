import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  ExternalLink,
  Github,
} from "lucide-react";

import SectionHeading from "@/components/common/SectionHeading";
import { useProjects } from "@/hooks/useProjects";

const TWEEN_FACTOR = 0.18;

export default function Projects() {
  const autoplay = useRef(
    Autoplay({
      delay: 6000,
      stopOnInteraction: true,
      stopOnMouseEnter: true,
    })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
  {
    loop: true,

    // smoother center
    align: "center",

    // important
    dragFree: true,

    // smoother physics
    duration: 40,

    // better touch
    skipSnaps: true,

    containScroll: false,

    // smoother momentum
    watchDrag: true,
  },
  [autoplay.current]
);

  const [selected, setSelected] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const tweenNodes = useRef<HTMLElement[]>([]);

  // Cache nodes once
  const setTweenNodes = useCallback(() => {
    if (!emblaApi) return;

    tweenNodes.current = emblaApi.slideNodes().map((slide) => {
      return slide.querySelector(".embla__tween") as HTMLElement;
    });
  }, [emblaApi]);

  // optimized animation
  const tweenScale = useCallback(() => {
    if (!emblaApi) return;

    const scrollProgress = emblaApi.scrollProgress();

    emblaApi.scrollSnapList().forEach((snap, index) => {
      const diff = Math.abs(snap - scrollProgress);

      const scale = 1 - Math.min(diff * TWEEN_FACTOR, 0.12);

      const opacity = 1 - Math.min(diff * 0.5, 0.45);

      const node = tweenNodes.current[index];

      if (!node) return;

      node.style.transform = `scale(${scale})`;
      node.style.opacity = `${opacity}`;
    });
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    setTweenNodes();

    setScrollSnaps(emblaApi.scrollSnapList());

    const onSelect = () => {
      setSelected(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("scroll", tweenScale);
    emblaApi.on("select", onSelect);

    tweenScale();
    onSelect();

    return () => {
      emblaApi.off("scroll", tweenScale);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, tweenScale, setTweenNodes]);

  const toggle = () => {
    if (isPlaying) {
      autoplay.current.stop();
    } else {
      autoplay.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  const projects = useProjects();

  return (
    <section
      id="projects"
      className="relative py-24 md:py-32 overflow-hidden"
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Selected Work"
          title="Projects I've built and shipped."
          description="Smooth and optimized project showcase carousel."
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-14"
      >
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {projects.map((p) => (
              <div
                key={p.id}
                className="
                  min-w-0
                  flex-[0_0_50%]
                  sm:flex-[0_0_50%]
                  lg:flex-[0_0_35%]
                  px-3
                "
              >
                <div className="embla__tween will-change-transform">
                  <article
                    className="
                      group
                      overflow-hidden
                      rounded-3xl
                      border
                      border-[color:var(--color-border)]
                      bg-[color:var(--color-surface)]
                      shadow-soft
                      transition-all
                      duration-300
                    "
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.title}
                        loading="lazy"
                        className="
                          h-full
                          w-full
                          object-cover
                          transition-transform
                          duration-700
                          group-hover:scale-105
                        "
                      />
                    </div>

                    <div className="p-6">
                      <div className="flex flex-wrap gap-2">
                        {p.stack.map((s) => (
                          <span
                            key={s}
                            className="
                              rounded-full
                              border
                              px-3
                              py-1
                              text-[11px]
                            "
                          >
                            {s}
                          </span>
                        ))}
                      </div>

                      <h3
                        className="
                          mt-4
                          text-2xl
                          font-bold
                          text-[color:var(--color-text)]
                        "
                      >
                        {p.title}
                      </h3>

                      <p
                        className="
                          mt-3
                          text-sm
                          leading-relaxed
                          text-[color:var(--color-muted)]
                        "
                      >
                        {p.description}
                      </p>

                      <div className="mt-6 flex items-center gap-3">
                        {p.live && (
                          <a
                            href={p.live}
                            target="_blank"
                            rel="noreferrer"
                            className="
                              inline-flex
                              items-center
                              gap-2
                              rounded-full
                              border
                              px-4
                              py-2
                              text-sm
                            "
                          >
                            <ExternalLink size={14} />
                            Live
                          </a>
                        )}

                        {p.code && (
                          <a
                            href={p.code}
                            target="_blank"
                            rel="noreferrer"
                            className="
                              inline-flex
                              items-center
                              gap-2
                              rounded-full
                              border
                              px-4
                              py-2
                              text-sm
                            "
                          >
                            <Github size={14} />
                            Code
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="mx-auto mt-10 flex max-w-6xl items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => emblaApi?.scrollPrev()}
              className="
                grid
                h-11
                w-11
                place-items-center
                rounded-full
                border
              "
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={() => emblaApi?.scrollNext()}
              className="
                grid
                h-11
                w-11
                place-items-center
                rounded-full
                border
              "
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2">
            {scrollSnaps.map((_, i) => (
              <button
                key={i}
                onClick={() => emblaApi?.scrollTo(i)}
                className={`
                  h-2 rounded-full transition-all duration-300
                  ${
                    i === selected
                      ? "w-8 bg-black dark:bg-white"
                      : "w-2 bg-gray-400"
                  }
                `}
              />
            ))}
          </div>

          <button
            onClick={toggle}
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              px-4
              py-2
              text-sm
            "
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            {isPlaying ? "Pause" : "Play"}
          </button>
        </div>
      </motion.div>
    </section>
  );
}