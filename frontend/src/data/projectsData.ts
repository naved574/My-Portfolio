export type Project = {
  id: string;
  title: string;
  description: string;
  stack: string[];
  image: string;
  live?: string;
  code?: string;
  accent: string;
};

// Placeholder gradient "cover images" via inline SVG data URIs — no external dependencies.
const cover = (from: string, to: string, label: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 500'>
      <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='${from}'/><stop offset='100%' stop-color='${to}'/>
      </linearGradient></defs>
      <rect width='800' height='500' fill='url(#g)'/>
      <g font-family='Inter, sans-serif' fill='white' opacity='0.95'>
        <text x='48' y='440' font-size='42' font-weight='700' letter-spacing='-1'>${label}</text>
      </g>
      <g fill='white' opacity='0.12'>
        <circle cx='680' cy='120' r='120'/><circle cx='560' cy='80' r='60'/>
      </g>
    </svg>`
  )}`;

export const projectsData: Project[] = [
  {
    id: "p1",
    title: "Nimbus Dashboard",
    description:
      "An analytics dashboard with real-time charts, role-based access, and a focus on clarity for non-technical teams.",
    stack: ["React", "TypeScript", "Tailwind", "Node.js"],
    image: cover("#4F9CF9", "#6366f1", "Nimbus"),
    live: "#",
    code: "#",
    accent: "#4F9CF9",
  },
  {
    id: "p2",
    title: "Orbit Commerce",
    description:
      "Headless storefront with a motion-first product page, Stripe checkout, and a CMS-powered catalogue.",
    stack: ["Next.js", "Stripe", "Sanity"],
    image: cover("#10b981", "#06b6d4", "Orbit"),
    live: "#",
    code: "#",
    accent: "#10b981",
  },
  {
    id: "p3",
    title: "Palette Studio",
    description:
      "A collaborative color-system builder. Drag tokens, preview components live, and export for Tailwind or CSS.",
    stack: ["React", "Zustand", "Framer Motion"],
    image: cover("#f59e0b", "#ef4444", "Palette"),
    live: "#",
    code: "#",
    accent: "#f59e0b",
  },
  {
    id: "p4",
    title: "Echo Chat",
    description:
      "A realtime chat app with typing indicators, threaded replies, and end-to-end client-side encryption.",
    stack: ["React", "WebSocket", "Node.js"],
    image: cover("#8b5cf6", "#ec4899", "Echo"),
    live: "#",
    code: "#",
    accent: "#8b5cf6",
  },
  {
    id: "p5",
    title: "Trailhead",
    description:
      "A route-planning app for hikers — offline-ready maps, elevation graphs, and shareable trip notes.",
    stack: ["React", "Mapbox", "PWA"],
    image: cover("#14b8a6", "#0ea5e9", "Trailhead"),
    live: "#",
    code: "#",
    accent: "#14b8a6",
  },
  {
    id: "p6",
    title: "Quill CMS",
    description:
      "A lightweight, markdown-native CMS with a block editor, versioning, and a zero-config Git sync.",
    stack: ["React", "Node.js", "SQLite"],
    image: cover("#111827", "#374151", "Quill"),
    live: "#",
    code: "#",
    accent: "#111827",
  },
];