import { useScrollProgress } from "@/hooks/useScrollProgress";

export default function ScrollProgress() {
  const p = useScrollProgress();
  return (
    <div className="fixed left-0 right-0 top-0 z-[60] h-[2px] bg-transparent">
      <div
        className="h-full bg-primary origin-left"
        style={{ transform: `scaleX(${p})`, transition: "transform 80ms linear" }}
      />
    </div>
  );
}