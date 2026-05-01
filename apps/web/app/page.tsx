import { LiveFeed } from "./components/live-feed";
import { pocketBaseUrl } from "../lib/pocketbase";

export default function Home() {
  return (
    <main className="min-h-screen px-6 py-10 text-slate-100 sm:px-10 lg:px-16">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <section className="space-y-8">
          <div className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">
            Next.js + PocketBase + SSH TUI
          </div>

          <div className="space-y-5">
            <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-7xl">
              A portfolio people can visit from the browser or the terminal.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-300">
              The web app talks to PocketBase at{" "}
              <code className="rounded bg-white/10 px-2 py-1 font-mono text-sm">
                {pocketBaseUrl}
              </code>
              , while the SSH app serves a Bubble Tea interface on port 2222.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["Engine", "PocketBase admin UI and API on :8090"],
              ["Web", "Next.js and Tailwind on :3000"],
              ["TUI", "Wish SSH gateway on :2222"],
            ].map(([title, description]) => (
              <div className="rounded-2xl border border-white/10 bg-white/8 p-5" key={title}>
                <h2 className="font-semibold text-white">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 font-mono text-sm text-slate-300">
            <p>pnpm dev</p>
            <p className="mt-2 text-slate-500">ssh localhost -p 2222</p>
          </div>
        </section>

        <LiveFeed />
      </div>
    </main>
  );
}
