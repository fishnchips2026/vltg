import { useState, useCallback } from 'react';
import { encryptData, decryptData } from '@/lib/crypto';

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  pinned: boolean;
  tag?: string;
}

const TAGS = ['personal', 'work', 'ideas', 'encrypted'] as const;
export type NoteTag = typeof TAGS[number];
export const NOTE_TAGS = TAGS;

const createId = () => crypto.randomUUID();

const defaultNotes: Note[] = [
  {
    id: createId(),
    title: 'VLTG Notes — Local-First, Zero-Trust',
    content: `All data is persisted in localStorage with optional AES-256 encrypted backups. No telemetry. No remote sync. No accounts.\n\nArchitecture:\n- Client-side only — no server, no database, no network calls\n- Export produces AES-GCM encrypted .vltg files using Web Crypto API\n- PBKDF2 key derivation with 100k iterations + random salt per export\n- Notes are JSON-serialized, encrypted, then base64-encoded for portability\n\nWorkflow:\n- Use tags to organize by context (work, personal, ideas)\n- Pin critical notes for persistent top-level access\n- Search filters across title and body in real-time\n- Backup regularly — localStorage is not durable across browser resets`,
    createdAt: new Date(),
    updatedAt: new Date(),
    pinned: true,
    tag: 'personal',
  },
  {
    id: createId(),
    title: 'Threat Modeling for Personal OPSEC',
    content: `Define your adversary before choosing your tools.\n\n1. Asset Inventory — Identify what you're protecting: credentials, PII, comms, location data, financial records\n2. Threat Actors — Casual snoopers, targeted attackers, state-level adversaries, insider threats\n3. Attack Surface — Enumerate all entry points: devices, accounts, network exposure, social engineering vectors\n4. Risk Assessment — Likelihood × Impact matrix. Prioritize mitigations accordingly\n5. Control Selection:\n   - Compartmentalize identities (separate email, browser profiles, VMs)\n   - Hardware security keys (FIDO2/WebAuthn) over TOTP over SMS\n   - Full-disk encryption (LUKS/FileVault/BitLocker) with strong passphrases\n   - DNS-over-HTTPS or DNS-over-TLS to prevent query interception\n   - Tor or trusted VPN for network-level anonymity (understand the tradeoffs)\n6. Continuous Review — Threat landscapes shift. Re-evaluate quarterly.\n\nKey principle: security is always a tradeoff against usability. Match your defenses to your actual threat model, not hypothetical paranoia.`,
    createdAt: new Date(Date.now() - 3600000),
    updatedAt: new Date(Date.now() - 3600000),
    pinned: false,
    tag: 'personal',
  },
  {
    id: createId(),
    title: 'Android Hardening Checklist',
    content: `Beyond the defaults — a security-focused Android configuration.\n\nOS & Updates:\n- Use a device with long-term security patch support (Pixel, Samsung Enterprise)\n- Consider GrapheneOS or CalyxOS for de-Googled hardened builds\n- Enable automatic security updates; verify patch level monthly (Settings → About → Android security patch level)\n\nAuthentication & Encryption:\n- Enforce strong alphanumeric lock (not pattern/PIN — they're shoulder-surfable)\n- Verify FBE (File-Based Encryption) is active — standard on Android 10+\n- Use a hardware security key for Google account 2FA (Advanced Protection Program)\n\nNetwork:\n- Private DNS: set to dns.adguard.com or a self-hosted DoT resolver\n- Disable Wi-Fi auto-connect, Bluetooth scanning, NFC when idle\n- Use WireGuard-based VPN with a kill switch (always-on VPN in Settings → Network)\n\nApp Security:\n- Audit permissions quarterly — revoke everything non-essential\n- Disable installation from unknown sources globally\n- Use Shelter or Island for work profile isolation\n- Prefer F-Droid or Aurora Store for open-source apps\n\nAdvanced:\n- Enable OEM unlocking only when needed, re-lock after\n- Use Auditor (GrapheneOS) for verified boot attestation\n- Disable USB debugging in production; use ADB over Wi-Fi only on trusted networks\n- Review logcat periodically for anomalous package activity`,
    createdAt: new Date(Date.now() - 7200000),
    updatedAt: new Date(Date.now() - 7200000),
    pinned: false,
    tag: 'personal',
  },
  {
    id: createId(),
    title: 'Network Security — Beyond the Basics',
    content: `Practical network defense for professionals and power users.\n\nWi-Fi:\n- WPA3-SAE where supported; WPA2-AES minimum (disable TKIP)\n- Disable WPS unconditionally — trivially brutable\n- MAC filtering is not security — it's easily spoofed. Use 802.1X/RADIUS for real access control\n- Segment IoT devices onto a separate VLAN with no LAN access\n\nPublic/Untrusted Networks:\n- Assume all traffic is intercepted. VPN or don't connect\n- Verify captive portals don't inject JS — use a disposable browser profile\n- Evil twin detection: compare BSSID/channel against known APs\n- Prefer cellular hotspot for sensitive operations\n\nDNS:\n- Encrypted DNS (DoH/DoT) prevents ISP-level query logging\n- Self-host with Pi-hole + Unbound for recursive resolution without upstream trust\n- DNSSEC validation catches poisoning attacks\n\nMonitoring:\n- Run periodic nmap scans of your own network to detect rogue devices\n- Use Wireshark/tcpdump for traffic analysis during incident response\n- Monitor ARP tables for spoofing indicators\n- Set up alerts on unusual outbound connections (Suricata/Zeek)\n\nZero Trust Posture:\n- Never trust network location as an authentication factor\n- Mutual TLS (mTLS) for service-to-service communication\n- Microsegmentation over flat network architectures`,
    createdAt: new Date(Date.now() - 10800000),
    updatedAt: new Date(Date.now() - 10800000),
    pinned: false,
    tag: 'work',
  },
  {
    id: createId(),
    title: 'Data Privacy — Regulatory & Technical Controls',
    content: `Privacy is a systems problem, not just a policy checkbox.\n\nRegulatory Landscape:\n- GDPR (EU): lawful basis required for processing, 72h breach notification, right to erasure\n- CCPA/CPRA (California): opt-out of sale, right to know, private right of action for breaches\n- LGPD (Brazil), PIPA (South Korea), PIPL (China): converging on GDPR-like frameworks\n- Sector-specific: HIPAA (health), PCI-DSS (payments), FERPA (education)\n\nTechnical Controls:\n- Data minimization: collect only what's necessary, purge on schedule\n- Encryption at rest (AES-256) and in transit (TLS 1.3)\n- Tokenization for sensitive fields (PII, payment data)\n- Differential privacy for analytics — add calibrated noise to preserve individual privacy\n- Pseudonymization ≠ anonymization — understand the re-identification risk\n\nOperational Practices:\n- Data mapping: know where PII lives across all systems and third parties\n- Vendor risk assessments: DPAs, SOC 2 reports, sub-processor chains\n- Privacy-by-design: integrate DPIAs into your SDLC\n- Incident response plan with privacy-specific playbooks\n- Regular access reviews — principle of least privilege applies to data too\n\nPersonal OPSEC:\n- Compartmentalize email addresses by risk tier\n- Use aliasing services (SimpleLogin, addy.io) to limit exposure\n- Periodically audit data broker listings and submit removal requests\n- Browser fingerprinting resistance: Brave, Firefox with resistFingerprinting, or Tor`,
    createdAt: new Date(Date.now() - 14400000),
    updatedAt: new Date(Date.now() - 14400000),
    pinned: false,
    tag: 'work',
  },
];

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('vltg-notes');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((n: any) => ({
        ...n,
        createdAt: new Date(n.createdAt),
        updatedAt: new Date(n.updatedAt),
      }));
    }
    return defaultNotes;
  });
  const [activeNoteId, setActiveNoteId] = useState<string | null>(notes[0]?.id ?? null);
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const persist = useCallback((updated: Note[]) => {
    localStorage.setItem('vltg-notes', JSON.stringify(updated));
  }, []);

  const activeNote = notes.find(n => n.id === activeNoteId) ?? null;

  const filteredNotes = notes.filter(n => {
    const matchesTag = !filterTag || n.tag === filterTag;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q);
    return matchesTag && matchesSearch;
  });

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.updatedAt.getTime() - a.updatedAt.getTime();
  });

  const createNote = useCallback(() => {
    const note: Note = {
      id: createId(),
      title: 'Untitled',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      pinned: false,
    };
    const updated = [note, ...notes];
    setNotes(updated);
    setActiveNoteId(note.id);
    persist(updated);
  }, [notes, persist]);

  const updateNote = useCallback((id: string, changes: Partial<Pick<Note, 'title' | 'content' | 'pinned' | 'tag'>>) => {
    const updated = notes.map(n =>
      n.id === id ? { ...n, ...changes, updatedAt: new Date() } : n
    );
    setNotes(updated);
    persist(updated);
  }, [notes, persist]);

  const deleteNote = useCallback((id: string) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    if (activeNoteId === id) {
      setActiveNoteId(updated[0]?.id ?? null);
    }
    persist(updated);
  }, [notes, activeNoteId, persist]);

  const exportNotes = useCallback(async (password: string, customName?: string) => {
    const json = JSON.stringify(notes);
    const encrypted = await encryptData(json, password);
    const baseName = customName || `vltg-backup-${new Date().toISOString().slice(0, 10)}`;
    const filename = baseName.endsWith('.vltg') ? baseName : `${baseName}.vltg`;
    const blob = new Blob([encrypted], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    // Delay cleanup so the browser has time to start the download
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1000);
  }, [notes]);

  const importNotes = useCallback(async (file: File, password: string, merge = false) => {
    const text = await file.text();
    const json = await decryptData(text, password);
    const parsed = JSON.parse(json);
    const restored: Note[] = parsed.map((n: any) => ({
      ...n,
      createdAt: new Date(n.createdAt),
      updatedAt: new Date(n.updatedAt),
    }));
    if (merge) {
      const existingIds = new Set(notes.map(n => n.id));
      const newNotes = restored.filter(n => !existingIds.has(n.id));
      const merged = [...notes, ...newNotes];
      setNotes(merged);
      persist(merged);
    } else {
      setNotes(restored);
      setActiveNoteId(restored[0]?.id ?? null);
      persist(restored);
    }
  }, [notes, persist]);

  return {
    notes: sortedNotes,
    activeNote,
    activeNoteId,
    setActiveNoteId,
    createNote,
    updateNote,
    deleteNote,
    filterTag,
    setFilterTag,
    searchQuery,
    setSearchQuery,
    exportNotes,
    importNotes,
  };
}
