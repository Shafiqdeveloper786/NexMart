"use client";

import { useEffect } from 'react';

// Cyber Agent Studio ka sahi deployment origin jahan embed.js pari hui hai
const PROD_ORIGIN = 'https://cyber-agent-studio.vercel.app';

interface AgentEmbedScriptProps {
  agentId: string;
  accentColor?: string;
}

export function AgentEmbedScript({ agentId, accentColor = '#00f2ff' }: AgentEmbedScriptProps) {
  useEffect(() => {
    // 1. Agar script pehle se embedded hai toh dobara load na karein (Duplicate Prevention)
    if (document.getElementById('cyberagent-embed')) return;

    // 2. FIX: Direct PROD_ORIGIN use karein taake live site par 404 error na aaye
    const base = PROD_ORIGIN;

    // 3. Script element create karein aur append karein
    const s = document.createElement('script');
    s.id = 'cyberagent-embed';
    s.src = `${base}/embed.js?ts=${Date.now()}`;
    s.defer = true;
    s.setAttribute('data-agent-id', agentId);
    s.setAttribute('data-accent-color', accentColor);
    document.body.appendChild(s);

    // 4. Cleanup: Agar component unmount ho toh script remove ho jaye
    return () => {
      document.getElementById('cyberagent-embed')?.remove();
    };
  }, [agentId, accentColor]);

  return null; // Zero SSR surface, no hydration mismatch
}
