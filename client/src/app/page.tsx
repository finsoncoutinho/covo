export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-50 dark:bg-zinc-950 px-4">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.08),transparent_50%),radial-gradient(circle_at_70%_70%,rgba(6,182,212,0.08),transparent_50%)]" />
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="relative z-10 text-center">
        <h1 
          id="welcome-title" 
          className="bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-7xl dark:from-indigo-400 dark:via-violet-400 dark:to-cyan-300 transition-all duration-300 hover:scale-105"
        >
          Welcome to Covo
        </h1>
      </div>
    </main>
  );
}

