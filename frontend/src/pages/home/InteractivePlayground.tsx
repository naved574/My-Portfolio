import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Play, Terminal, Sparkles, CheckCircle, Flame, Layers, RefreshCw } from "lucide-react";

type FileTab = "server.ts" | "App.tsx" | "pipeline.yml";

const codeSnippets: Record<FileTab, string> = {
  "server.ts": `import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Dynamic Schema with auto-sync fallbacks
const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  featured: { type: Boolean, default: false },
  stack: [String]
});

export const startServer = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  app.listen(3000, () => {
    console.log("⚡ [server] Portfolio API online at port 3000");
  });
};`,

  "App.tsx": `import { motion } from "framer-motion";
import { useProjects } from "@/hooks/useProjects";

export default function FeaturedGrid() {
  const { data: projects } = useProjects();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          whileHover={{ scale: 1.02, y: -4 }}
          className="rounded-3xl border bg-surface p-6 shadow-soft"
        >
          <h3 className="text-xl font-bold">{project.title}</h3>
          <p className="text-muted text-sm">{project.bio}</p>
        </motion.div>
      ))}
    </div>
  );
}`,

  "pipeline.yml": `name: Continuous Deployment

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node & Cache
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'
          
      - name: Build and Lint
        run: |
          npm ci
          npm run lint
          npm run build
          
      - name: Deploy to Cloud Run
        uses: google-github-actions/deploy-cloudrun@v2
        with:
          service: portfolio-client
          region: asia-east1`
};

export default function InteractivePlayground() {
  const [activeTab, setActiveTab] = useState<FileTab>("server.ts");
  const [isRunning, setIsRunning] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [terminalProgress, setTerminalProgress] = useState(0);

  const simulateExecution = () => {
    if (isRunning) return;
    setIsRunning(true);
    setTerminalProgress(0);
    setTerminalLogs([]);

    const logs = [
      "ℹ [system] Spin up virtual sandboxed sandbox environment...",
      "✔ [system] System check OK. Node version: v22.23.1",
      "⚡ [npm] Installing required packages...",
      "✔ [npm] Added 47 packages in 1.1s",
      "⚒ [build] Compiling and bundling application source files...",
      "✔ [build] Vite compiled frontend static files successfully (dist/)",
      "⚙ [db] Opening persistent connection to in-memory fallback...",
      "✔ [db] Mongoose connected successfully. Synchronizing schema collections...",
      "✨ [server] Portfolio API running at http://localhost:3000",
      "🎉 [demo] Execution complete! Everything is running smoothly."
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < logs.length) {
        setTerminalLogs((prev) => [...prev, logs[currentLogIndex]]);
        setTerminalProgress(((currentLogIndex + 1) / logs.length) * 100);
        currentLogIndex++;
      } else {
        clearInterval(interval);
        setIsRunning(false);
      }
    }, 450);
  };

  // Pre-render the syntax highlighted lines
  const renderCode = (code: string) => {
    return code.split("\n").map((line, i) => {
      // Very basic keyword coloring to look premium without standard highlight libraries
      const parts = line.split(/(\s+)/);
      const coloredLine = parts.map((part, index) => {
        if (/^(const|let|var|import|export|from|default|function|return|await|async|class|name|on|push|branches|jobs|deploy|runs-on|steps|uses|with|run)$/.test(part.trim())) {
          return <span key={index} className="text-purple-400 font-semibold">{part}</span>;
        }
        if (/^(true|false|null|undefined)$/.test(part.trim())) {
          return <span key={index} className="text-amber-400 font-semibold">{part}</span>;
        }
        if (/^(string|number|boolean|any|void)$/.test(part.trim())) {
          return <span key={index} className="text-teal-400">{part}</span>;
        }
        if (/^(\/\/.*|#.*)$/.test(part.trim())) {
          return <span key={index} className="text-gray-500 italic">{part}</span>;
        }
        if (part.startsWith('"') || part.startsWith("'") || part.startsWith("`")) {
          return <span key={index} className="text-emerald-400">{part}</span>;
        }
        return <span key={index}>{part}</span>;
      });

      return (
        <div key={i} className="flex leading-6">
          <span className="w-10 select-none text-right pr-4 text-gray-600 font-mono text-xs leading-6">{i + 1}</span>
          <span className="flex-1 font-mono text-xs sm:text-sm text-gray-300 overflow-x-auto whitespace-pre">{coloredLine}</span>
        </div>
      );
    });
  };

  return (
    <section className="w-full bg-[var(--color-bg)] px-4 py-20 sm:px-8 md:px-12 relative overflow-hidden" id="sandbox">
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -z-10 w-[600px] h-[300px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center text-center mb-12">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-primary">
            <Sparkles size={12} className="animate-pulse" />
            Interactive Lab
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[color:var(--color-text)] sm:text-4xl font-display">
            Under the Hood Experience
          </h2>
          <p className="mt-4 max-w-xl text-sm sm:text-base leading-relaxed text-[color:var(--color-muted)]">
            Explore the real production code architecture backing this application. Choose a module and simulate its deployment live.
          </p>
        </div>

        {/* Dynamic Sandbox Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Controls & Metrics (3 Columns on Large Screen) */}
          <div className="lg:col-span-4 flex flex-col gap-6 justify-between">
            <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6 flex flex-col justify-between h-full relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 text-primary/10 group-hover:scale-110 duration-500">
                <Flame size={120} />
              </div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-[color:var(--color-text)] flex items-center gap-2">
                  <Terminal size={18} className="text-primary" />
                  Dev Environment
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-muted)]">
                  Toggle the file tabs in the editor panel on the right to examine the component layers, or start a sandbox run to trigger a mockup container compile.
                </p>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between text-xs border-b border-[color:var(--color-border)] pb-2">
                    <span className="text-[color:var(--color-muted)]">Target Environment</span>
                    <span className="font-mono font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded">production-cloud</span>
                  </div>
                  <div className="flex items-center justify-between text-xs border-b border-[color:var(--color-border)] pb-2">
                    <span className="text-[color:var(--color-muted)]">Database Fallback</span>
                    <span className="font-mono font-semibold text-[color:var(--color-text)]">Mongoose (In-Memory)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs border-b border-[color:var(--color-border)] pb-2">
                    <span className="text-[color:var(--color-muted)]">Deployment Mode</span>
                    <span className="font-mono font-semibold text-[color:var(--color-text)]">Hot Reload (HMR Off)</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 relative z-10">
                <button
                  disabled={isRunning}
                  onClick={simulateExecution}
                  className={`relative overflow-hidden w-full group inline-flex items-center justify-center gap-2.5 rounded-xl px-5 py-3.5 text-sm font-semibold transition-all duration-300 shadow-soft select-none ${
                    isRunning
                      ? "bg-primary/20 text-primary/70 cursor-not-allowed"
                      : "bg-black hover:bg-gray-900 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100 hover:shadow-lift hover:-translate-y-0.5"
                  }`}
                  id="run-sandbox-btn"
                >
                  {isRunning ? (
                    <>
                      <RefreshCw size={16} className="animate-spin text-primary" />
                      Executing Sandbox Compile...
                    </>
                  ) : (
                    <>
                      <Play size={16} className="fill-current" />
                      Run Sandbox Simulation
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* IDE Container (8 Columns on Large Screen) */}
          <div className="lg:col-span-8 flex flex-col rounded-2xl border border-[color:var(--color-border)] bg-gray-950 overflow-hidden shadow-lift max-w-full">
            
            {/* Tab header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-900/80 border-b border-gray-800 select-none">
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                {(["server.ts", "App.tsx", "pipeline.yml"] as FileTab[]).map((tab) => {
                  const isActive = activeTab === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                        isActive
                          ? "bg-gray-800 text-white shadow"
                          : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/40"
                      }`}
                      id={`tab-btn-${tab.replace(".", "-")}`}
                    >
                      <Code2 size={13} className={isActive ? "text-primary" : "text-gray-500"} />
                      {tab}
                      {isActive && (
                        <motion.span
                          layoutId="activeTabUnderline"
                          className="absolute bottom-0 inset-x-3 h-0.5 bg-primary rounded-full"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Simulated Window Dots */}
              <div className="hidden sm:flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-500/80" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <span className="h-3 w-3 rounded-full bg-green-500/80" />
              </div>
            </div>

            {/* Code Workspace Display */}
            <div className="relative p-5 overflow-auto bg-gray-950 min-h-[300px] max-h-[400px] scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-1 font-mono"
                >
                  {renderCode(codeSnippets[activeTab])}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Simulated Terminal Shell */}
            <div className="border-t border-gray-800 bg-gray-950 flex flex-col max-h-[220px]">
              
              {/* Terminal Header */}
              <div className="flex items-center justify-between px-5 py-2.5 bg-gray-900/60 border-b border-gray-900/80 select-none">
                <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                  <Terminal size={14} className="text-emerald-400 animate-pulse" />
                  <span>Sandbox Output Terminal</span>
                </div>
                {isRunning && (
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary"
                        animate={{ width: `${terminalProgress}%` }}
                        transition={{ ease: "easeInOut" }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-primary font-semibold">{Math.round(terminalProgress)}%</span>
                  </div>
                )}
              </div>

              {/* Terminal Logs View */}
              <div className="p-4 overflow-y-auto min-h-[110px] max-h-[140px] font-mono text-xs text-gray-300 space-y-1.5 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                {terminalLogs.length === 0 && !isRunning ? (
                  <div className="flex flex-col items-center justify-center py-6 text-gray-500">
                    <p>Terminal idle. Tap "Run Sandbox Simulation" above to execute logs.</p>
                  </div>
                ) : (
                  terminalLogs.map((log, i) => {
                    let colorClass = "text-gray-300";
                    if (log.startsWith("✔")) colorClass = "text-emerald-400";
                    else if (log.startsWith("⚡") || log.startsWith("✨")) colorClass = "text-amber-400";
                    else if (log.startsWith("⚒") || log.startsWith("ℹ")) colorClass = "text-sky-400";
                    else if (log.startsWith("🎉")) colorClass = "text-emerald-300 font-bold";

                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.15 }}
                        className={`${colorClass} flex items-start gap-1`}
                      >
                        <span className="select-none text-gray-600 mr-2">$</span>
                        <span className="leading-5">{log}</span>
                      </motion.div>
                    );
                  })
                )}
                {isRunning && (
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="inline-block w-2 h-4 bg-emerald-400 ml-1 translate-y-0.5"
                  />
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
