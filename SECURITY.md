# Security Policy

## Overview

VLTG.notes is a **local-first, zero-trust** application. All data is processed and stored entirely within your browser — no servers, no accounts, no network calls. This architecture eliminates entire classes of security vulnerabilities by design.

---

## Threat Model

### In scope

| Threat | Mitigation |
|--------|-----------|
| **Data at rest** | Notes live in `localStorage`, protected by the browser's same-origin policy. Enable full-disk encryption on your OS for physical-device protection. |
| **Data in transit (exports)** | Exported `.vltg` files are encrypted with AES-256-GCM. An attacker with access to the file cannot read it without the password. |
| **Weak export passwords** | PBKDF2 with 100,000 iterations slows brute-force attacks. Users should choose strong passphrases. |
| **Rainbow table attacks** | A cryptographically random 16-byte salt is generated per export, making precomputed attacks infeasible. |
| **Nonce reuse** | A fresh 12-byte IV is generated per export using `crypto.getRandomValues()`, preventing nonce reuse with the same key. |
| **Ciphertext tampering** | AES-GCM provides authenticated encryption — any modification to the ciphertext is detected and rejected on decryption. |

### Out of scope

| Threat | Reason |
|--------|--------|
| **Server-side attacks** | No server exists. There is no backend, API, or database to compromise. |
| **Man-in-the-middle** | The app makes zero network requests after initial page load. There is no data to intercept. |
| **Account compromise** | No accounts exist. There are no credentials to steal. |
| **Cross-site scripting (XSS)** | React's JSX escaping and Content Security Policy headers (when deployed) mitigate injection. Markdown rendering uses `react-markdown`, which does not use `dangerouslySetInnerHTML`. |
| **Supply chain attacks** | Mitigated by pinning dependency versions and using `npm audit` in CI. |

---

## Cryptography Details

All cryptographic operations use the browser-native **Web Crypto API** — no third-party crypto libraries are included.

### Export Encryption Pipeline

```
plaintext (JSON) → PBKDF2 key derivation → AES-256-GCM encrypt → base64 encode → .vltg file
```

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| **Algorithm** | AES-256-GCM | NIST-approved authenticated encryption — confidentiality + integrity in one pass |
| **Key derivation** | PBKDF2-SHA-256 | Stretches user passwords into 256-bit cryptographic keys |
| **Iterations** | 100,000 | Meets OWASP minimum recommendation for PBKDF2-SHA-256 (2023) |
| **Salt** | 16 bytes, random per export | Unique per file — prevents rainbow table and precomputation attacks |
| **IV / Nonce** | 12 bytes, random per export | GCM standard nonce length; never reused with the same derived key |

### File Format (`.vltg`)

```
Base64( [16-byte salt] [12-byte IV] [ciphertext + GCM authentication tag] )
```

The import process reverses this: decode base64 → extract salt and IV → derive key from password via PBKDF2 → AES-GCM decrypt → verify authentication tag → parse JSON.

**Source:** [`src/lib/crypto.ts`](src/lib/crypto.ts)

---

## Browser Security Model

VLTG.notes relies on the browser's built-in security mechanisms:

- **Same-origin policy** — `localStorage` is isolated per origin. Other websites cannot read your notes.
- **Content Security Policy** — When deployed with proper headers, inline script injection is blocked.
- **Secure context** — The Web Crypto API requires HTTPS in production, ensuring the app code is delivered over an encrypted channel.
- **Sandboxed execution** — Browser tabs run in isolated processes, preventing cross-tab memory access.

### Recommendations

1. **Use full-disk encryption** (BitLocker, FileVault, LUKS) — protects `localStorage` data if the device is stolen.
2. **Lock your browser profile** — A shared browser profile means shared `localStorage`.
3. **Use strong export passwords** — AES-256-GCM is only as strong as the password. Use a passphrase (4+ random words).
4. **Keep your browser updated** — Security patches for the rendering engine and Web Crypto API are critical.
5. **Export regularly** — `localStorage` has a ~5-10 MB limit and can be cleared by the browser under storage pressure.

---

## Dependency Security

- All dependencies are open-source with permissive licenses (MIT, Apache-2.0, ISC).
- No dependencies perform network requests, telemetry, or analytics.
- `npm audit` is used to check for known vulnerabilities.
- See [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md) for a full dependency inventory.

---

## Reporting a Vulnerability

If you discover a security issue, please report it responsibly:

1. **Do not** open a public GitHub issue for security vulnerabilities.
2. Email **[fishnchips2026](https://github.com/fishnchips2026)** via GitHub's private messaging or open a [GitHub Security Advisory](https://github.com/fishnchips2026/vltg/security/advisories/new).
3. Include a clear description of the vulnerability, steps to reproduce, and potential impact.
4. You will receive acknowledgment within 48 hours.

We appreciate responsible disclosure and will credit reporters in the changelog (unless anonymity is preferred).

---

## Security Checklist

- [x] No server-side code — zero network attack surface
- [x] No telemetry, analytics, or tracking
- [x] No third-party crypto libraries — Web Crypto API only
- [x] AES-256-GCM authenticated encryption for exports
- [x] PBKDF2 key derivation with 100k iterations
- [x] Random salt and IV per export
- [x] React JSX auto-escaping for XSS prevention
- [x] Safe Markdown rendering (no `dangerouslySetInnerHTML`)
- [x] MIT-licensed open source — full code auditability
