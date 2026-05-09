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


export const projectsData: Project[] = [
  {
    id: "p1",
    title: "Nimbus Dashboard",
    description:
      "An analytics dashboard with real-time charts, role-based access, and a focus on clarity for non-technical teams.",
    stack: ["React", "TypeScript", "Tailwind", "Node.js"],
    // image: cover("#4F9CF9", "#6366f1", "Nimbus"),
    image: "https://images.unsplash.com/photo-1634084462412-b54873c0a56d?q=80&w=1460&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
    // image: cover("#10b981", "#06b6d4", "Orbit"),
    image: "https://images.unsplash.com/photo-1642132652860-471b4228023e?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
    image: "https://media.istockphoto.com/id/1053578536/photo/travel-resort-webstore-web-site-template-mockup-isolated.jpg?s=612x612&w=0&k=20&c=BV7ioMXefI4D3L-jQowB_OyzYEsgQjsLgJD7mMBhATI=",
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
    image: "https://media.istockphoto.com/id/493507168/photo/online-shopping-e-business-browsing-internet-concept.jpg?s=612x612&w=0&k=20&c=GGGQmAMRDjd7b0RE5RCmt1RgVEeG-dgBc_ahZlTF1a0=",
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
    image: "https://media.istockphoto.com/id/1255403703/vector/people-with-purchases-and-devices-clothing-store-online-shopping-mobile-marketing-e-commerce.jpg?s=612x612&w=0&k=20&c=wifByuFaeHurUbltmxLSWuwU7G0T-NuBqSU9qTKeax4=",
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
    image: "https://media.istockphoto.com/id/1083579602/vector/%C3%B0%C3%B1%C3%B0%C3%B0%C3%B0%C3%B0%C3%B1%C3%B0%C2%B5-rgb.jpg?s=612x612&w=0&k=20&c=2fnaF5su4Vu-6CoxTFixKY8z1ffhExFdiojDWmB5nPA=",
    live: "#",
    code: "#",
    accent: "#111827",
  },
];