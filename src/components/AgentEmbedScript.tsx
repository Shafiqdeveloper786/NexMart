"use client";
import { useEffect } from 'react';

const PROD_ORIGIN = 'https://cyber-agent-studio.vercel.app';

interface AgentEmbedScriptProps {
  agentId: string;
  accentColor?: string;
}

export function AgentEmbedScript({ agentId, accentColor = '#00f2ff' }: AgentEmbedScriptProps) {
  useEffect(() => {
    if (document.getElementById('cyberagent-embed')) return;

    const base = window.location.origin.includes('localhost')
      ? PROD_ORIGIN
      : window.location.origin;

    const s = document.createElement('script');
    s.id = 'cyberagent-embed';
    s.src = `${base}/embed.js?ts=${Date.now()}`;
    s.defer = true;
    s.setAttribute('data-agent-id', agentId);
    s.setAttribute('data-accent-color', accentColor);
    document.body.appendChild(s);

    return () => document.getElementById('cyberagent-embed')?.remove();
  }, [agentId, accentColor]);

  return null;
}
