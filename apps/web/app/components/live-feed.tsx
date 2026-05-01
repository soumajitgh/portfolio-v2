"use client";

import { useEffect, useState } from "react";
import { createPocketBaseClient } from "../../lib/pocketbase";

type LiveSession = {
  id: string;
  username?: string;
  address?: string;
  created?: string;
};

type Status = "connecting" | "connected" | "waiting";

export function LiveFeed() {
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [status, setStatus] = useState<Status>("connecting");

  useEffect(() => {
    const pb = createPocketBaseClient();
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    async function connect() {
      try {
        const records = await pb.collection("ssh_sessions").getFullList<LiveSession>({
          requestKey: null,
          sort: "-created",
        });

        if (cancelled) {
          return;
        }

        setSessions(records);
        unsubscribe = await pb.collection("ssh_sessions").subscribe<LiveSession>(
          "*",
          (event) => {
            setSessions((current) => {
              if (event.action === "delete") {
                return current.filter((session) => session.id !== event.record.id);
              }

              const next = current.filter((session) => session.id !== event.record.id);
              return [event.record, ...next].slice(0, 5);
            });
          },
        );
        setStatus("connected");
      } catch {
        setStatus("waiting");
      }
    }

    void connect();

    return () => {
      cancelled = true;
      unsubscribe?.();
      pb.realtime.unsubscribe();
    };
  }, []);

  return (
    <section className="rounded-3xl border border-white/10 bg-white/8 p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-200">
            Live SSH Feed
          </p>
          <h2 className="mt-2 text-2xl font-semibold">Terminal visitors</h2>
        </div>
        <span className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100">
          {status}
        </span>
      </div>

      <div className="mt-6 space-y-3">
        {sessions.length > 0 ? (
          sessions.map((session) => (
            <div
              className="rounded-2xl border border-white/10 bg-slate-950/70 p-4"
              key={session.id}
            >
              <p className="font-mono text-sm text-white">
                {session.username ?? "anonymous"}@portfolio
              </p>
              <p className="mt-1 text-sm text-slate-400">
                {session.address ?? "ssh session"}{" "}
                {session.created ? `- ${new Date(session.created).toLocaleString()}` : ""}
              </p>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-white/15 bg-slate-950/50 p-4 text-sm text-slate-300">
            Start PocketBase and create an `ssh_sessions` collection to stream visitors
            here.
          </div>
        )}
      </div>
    </section>
  );
}
