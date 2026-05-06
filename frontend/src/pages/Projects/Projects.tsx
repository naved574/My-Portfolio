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
// import { projects } from "@/data/projectsData";
import { useProjects } from "@/hooks/useProjects";

const TWEEN_FACTOR = 1.1;

export default function Projects() {
  const autoplay = useRef(
    Autoplay({ delay: 8000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "center",
      containScroll: false,
      duration: 30, // ~500ms at 60fps
      dragFree: false,
    },
    [autoplay.current]
  );

  const [selected, setSelected] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const tweenNodes = useRef<HTMLElement[]>([]);

  const setTweenNodes = useCallback(() => {
    if (!emblaApi) return;
    tweenNodes.current = emblaApi.slideNodes().map(
      (slide) => slide.querySelector(".embla__tween") as HTMLElement
    );
  }, [emblaApi]);

  const tweenScale = useCallback(() => {
    if (!emblaApi) return;
    const engine = emblaApi.internalEngine();
    const scrollProgress = emblaApi.scrollProgress();
    const slidesInView = emblaApi.slidesInView();
    const isScrollEvent = engine.options.loop ? true : false;

    emblaApi.scrollSnapList().forEach((snap, snapIndex) => {
      let diffToTarget = snap - scrollProgress;

      if (isScrollEvent) {
        engine.slideLooper.loopPoints.forEach((loopItem) => {
          const target = loopItem.target();
          if (snapIndex === loopItem.index && target !== 0) {
            const sign = Math.sign(target);
            if (sign === -1) diffToTarget = snap - (1 + scrollProgress);
            if (sign === 1) diffToTarget = snap + (1 - scrollProgress);
          }
        });
      }

      const tweenValue = 1 - Math.abs(diffToTarget * TWEEN_FACTOR);
      const clamped = Math.max(0, Math.min(1, tweenValue));
      const scale = 0.85 + clamped * 0.15;
      const opacity = 0.6 + clamped * 0.4;
      const node = tweenNodes.current[snapIndex];
      if (node) {
        node.style.transform = `scale(${scale.toFixed(3)})`;
        node.style.opacity = opacity.toFixed(3);
      }
      // Keep unused var referenced
      void slidesInView;
    });
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    setTweenNodes();
    tweenScale();
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", () => {
      setScrollSnaps(emblaApi.scrollSnapList());
      setTweenNodes();
      tweenScale();
    });
    emblaApi.on("scroll", tweenScale);
    emblaApi.on("slideFocus", tweenScale);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, setTweenNodes, tweenScale]);

  const toggle = () => {
    const ap = autoplay.current;
    if (!ap) return;
    if (isPlaying) {
      ap.stop();
      setIsPlaying(false);
    } else {
      ap.play();
      setIsPlaying(true);
    }
  };

  const projects = useProjects();
  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();
  const scrollTo = (i: number) => emblaApi?.scrollTo(i);

  return (
    <section id="projects" className="relative dark:bg-[color:var(--color-text)] dark:text-[color:var(--color-text)] py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Selected Work"
          title="Projects I've built and shipped."
          description="A rotating look at recent work. Drag, swipe, or let it play — it loops seamlessly every 8 seconds."
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="mt-12"
      >
        <div className="embla" ref={emblaRef}>
          <div className="embla__container">
            {projects.map((p) => (
              <div key={p.id} className="embla__slide">
                <div className="embla__tween">
                  <article className="group relative overflow-hidden rounded-[20px] border border-[color:var(--color-border)] bg-white shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.title}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/30 to-transparent" />
                    </div>
                    <div className="p-6">
                      <div className="flex flex-wrap gap-1.5">
                        {p.stack.map((s) => (
                          <span
                            key={s}
                            className="rounded-full border border-[color:var(--color-border)] bg-black px-2.5 py-0.5 text-[11px] font-medium text-white"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                      <h3 className="font-display mt-3 text-2xl font-bold text-black">
                        {p.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-muted)]">
                        {p.description}
                      </p>
                      <div className="mt-5 flex items-center gap-2">
                        {p.live && (
                          <a
                            href={p.live}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-full bg-black px-3.5 py-1.5 text-xs font-medium text-white hover:bg-black"
                          >
                            <ExternalLink size={13} /> Live
                          </a>
                        )}
                        {p.code && (
                          <a
                            href={p.code}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--color-border)] bg-white px-3.5 py-1.5 text-xs font-medium text-black hover:border-[color:var(--color-text)]"
                          >
                            <Github size={13} /> Code
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
        <div className="mx-auto mt-8 flex max-w-6xl items-center justify-between gap-4 px-5 md:px-8">
          <div className="flex items-center bg-[color:var(--color-surface)] gap-2">
            <button
              onClick={scrollPrev}
              aria-label="Previous project"
              className="grid h-10 w-10 place-items-center rounded-full border border-[color:var(--color-border)]  transition-all hover:-translate-y-0.5 hover:border-[color:var(--color-text)]"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={scrollNext}
              aria-label="Next project"
              className="grid h-10 w-10 place-items-center rounded-full border border-[color:var(--color-border)]  transition-all hover:-translate-y-0.5 hover:border-[color:var(--color-text)]"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="hidden items-center gap-1.5 md:flex">
            {scrollSnaps.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                aria-label={`Go to project ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${i === selected ? "w-6 bg-[color:var(--color-text)]" : "w-1.5 bg-[color:var(--color-border)]"
                  }`}
              />
            ))}
          </div>

          <button
            onClick={toggle}
            aria-label={isPlaying ? "Pause autoplay" : "Play autoplay"}
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-2 text-sm font-medium text-[color:var(--color-text)] transition-all hover:-translate-y-0.5 hover:border-[color:var(--color-text)]"
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            {isPlaying ? "Pause" : "Play"}
          </button>
        </div>
      </motion.div>
    </section>
  );
}