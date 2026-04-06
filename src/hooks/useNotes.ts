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
    title: 'Welcome to VLTG Notes',
    content: `Your private, high-voltage notebook.\n\nEverything stays local. No tracking. No cloud sync. Just you and your thoughts at full throttle.\n\n⚡ Tips:\n- Click + to create a new note\n- Pin important notes to keep them at the top\n- Tag notes for quick filtering\n- Your data never leaves this device`,
    createdAt: new Date(),
    updatedAt: new Date(),
    pinned: true,
    tag: 'personal',
  },
  {
    id: createId(),
    title: 'Quick Ideas',
    content: 'Dump raw thoughts here. Refine later.\n\nNo judgment. No structure. Just capture.',
    createdAt: new Date(Date.now() - 3600000),
    updatedAt: new Date(Date.now() - 3600000),
    pinned: false,
    tag: 'ideas',
  },
  {
    id: createId(),
    title: 'Data Privacy Tips',
    content: `🔒 Protect Your Digital Footprint\n\n1. Use unique, strong passwords for every account — a password manager helps\n2. Enable two-factor authentication (2FA) wherever possible\n3. Review app permissions regularly — revoke access you don't need\n4. Avoid sharing personal info on public forums or social media\n5. Use end-to-end encrypted messaging apps (Signal, WhatsApp)\n6. Regularly check haveibeenpwned.com for breached accounts\n7. Opt out of data broker sites that sell your info\n8. Read privacy policies — or at least check what data an app collects\n\nRemember: if a product is free, you're usually the product.`,
    createdAt: new Date(Date.now() - 7200000),
    updatedAt: new Date(Date.now() - 7200000),
    pinned: false,
    tag: 'personal',
  },
  {
    id: createId(),
    title: 'Android Security Essentials',
    content: `🤖 Keep Your Android Device Secure\n\n• Only install apps from Google Play Store or trusted sources\n• Keep your OS and apps updated — patches fix known vulnerabilities\n• Use a screen lock (fingerprint, PIN, or pattern — avoid simple swipes)\n• Enable Google Play Protect to scan for harmful apps\n• Turn off Bluetooth and NFC when not in use\n• Encrypt your device (Settings → Security → Encryption)\n• Be cautious with app permissions — a flashlight app doesn't need your contacts\n• Use a VPN on untrusted networks\n• Disable USB debugging unless you're actively developing\n• Set up Find My Device in case your phone is lost or stolen\n\nBonus: Review your Google account security checkup at myaccount.google.com/security-checkup`,
    createdAt: new Date(Date.now() - 10800000),
    updatedAt: new Date(Date.now() - 10800000),
    pinned: false,
    tag: 'personal',
  },
  {
    id: createId(),
    title: 'Public Wi-Fi Survival Guide',
    content: `📡 Stay Safe on Public Wi-Fi\n\nPublic networks (cafés, airports, hotels) are hunting grounds for attackers.\n\n⚠️ Risks:\n- Man-in-the-middle attacks — someone intercepts your traffic\n- Evil twin networks — fake hotspots mimicking legitimate ones\n- Packet sniffing — unencrypted data can be read by anyone nearby\n\n✅ Do:\n- Always use a VPN — it encrypts all your traffic\n- Verify the network name with staff before connecting\n- Use HTTPS-only sites (look for the padlock icon)\n- Forget the network after you're done\n- Turn off auto-connect to open networks\n\n❌ Don't:\n- Access banking or sensitive accounts without a VPN\n- Share files or enable AirDrop/Nearby Share\n- Stay connected longer than necessary\n- Trust captive portals with personal info\n\nPro tip: Use your phone's mobile hotspot instead when handling sensitive tasks.`,
    createdAt: new Date(Date.now() - 14400000),
    updatedAt: new Date(Date.now() - 14400000),
    pinned: false,
    tag: 'personal',
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
