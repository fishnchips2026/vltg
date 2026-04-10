# Privacy Policy

**Last updated:** April 2025

---

## Summary

VLTG.notes collects **no data whatsoever**. Your notes never leave your browser. There are no accounts, no servers, no analytics, and no cookies. This document exists for transparency — not because there is anything to disclose.

---

## Data Collection

| Category | Collected? | Details |
|----------|-----------|---------|
| **Personal information** | ❌ No | No accounts, no emails, no names, no identifiers |
| **Note content** | ❌ No | Notes are stored in your browser's `localStorage` only |
| **Usage analytics** | ❌ No | No page views, click tracking, or behavioral analytics |
| **Error reporting** | ❌ No | No crash reports, no Sentry, no error telemetry |
| **Cookies** | ❌ No | No cookies of any kind — no session, no tracking, no consent banners needed |
| **IP addresses** | ❌ No | The app makes zero network requests after initial page load |
| **Device fingerprinting** | ❌ No | No canvas fingerprinting, no WebGL hashing, no font enumeration |
| **Third-party trackers** | ❌ No | No Google Analytics, no Facebook Pixel, no ad networks |
| **Location data** | ❌ No | No geolocation API usage |

---

## Data Storage

### Where your data lives

All notes are stored in your browser's `localStorage` under the key `vltg-notes`. This data:

- **Never leaves your device** — no sync, no cloud backup, no server upload
- **Is isolated per origin** — other websites cannot access it (browser same-origin policy)
- **Is not encrypted at rest** by default — enable full-disk encryption on your OS for device-level protection
- **Can be cleared** by the browser under storage pressure or when clearing browsing data
- **Has size limits** — typically 5-10 MB depending on the browser

### Encrypted exports

When you export notes as a `.vltg` file:

- The file is encrypted locally using **AES-256-GCM** with a password you choose
- The encryption happens entirely in your browser via the **Web Crypto API**
- The encrypted file is saved to your local filesystem — it is **not uploaded anywhere**
- Without the correct password, the file contents are computationally infeasible to recover

See [`SECURITY.md`](SECURITY.md) for full cryptography details.

---

## Network Activity

VLTG.notes makes **zero network requests** during normal operation. After the initial page load:

- No API calls
- No WebSocket connections
- No beacon/ping requests
- No font or asset loading from external CDNs
- No requests to any domain

You can verify this yourself by opening your browser's Developer Tools → Network tab while using the app.

---

## Third-Party Services

VLTG.notes uses **no third-party services**:

| Service type | Used? |
|-------------|-------|
| Authentication providers | ❌ |
| Cloud databases | ❌ |
| Analytics platforms | ❌ |
| Error monitoring | ❌ |
| CDNs for runtime assets | ❌ |
| Ad networks | ❌ |
| Social media integrations | ❌ |
| Payment processors | ❌ |

### Third-party code

The app is built with open-source libraries (React, Tailwind CSS, etc.). These libraries:

- Run entirely client-side
- Do not phone home or collect telemetry
- Are listed in [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md)

---

## Children's Privacy

VLTG.notes does not collect any data from anyone, including children. There is no age verification because there is nothing to verify — the app has no concept of users or identity.

---

## GDPR, CCPA, and Regulatory Compliance

Because VLTG.notes collects no personal data and makes no network requests:

- **GDPR** (EU) — No data processing occurs. No Data Protection Officer is required. No data subject access requests are applicable because no data is held.
- **CCPA** (California) — No personal information is sold, shared, or collected. No opt-out mechanism is needed because there is nothing to opt out of.
- **PIPEDA** (Canada), **LGPD** (Brazil), **POPIA** (South Africa) — Same reasoning applies. Zero data collection means zero regulatory obligations.

---

## Data Deletion

To delete all your data:

1. **In the app** — Delete individual notes using the delete button, or
2. **In your browser** — Clear site data for the app's domain (Settings → Privacy → Clear browsing data), or
3. **Manually** — Open Developer Tools → Application → Local Storage → delete the `vltg-notes` key

Once deleted, data cannot be recovered unless you have an exported `.vltg` backup file.

---

## Changes to This Policy

If this privacy policy changes, the update will be reflected in this file with a new "Last updated" date. Since VLTG.notes is open source, all changes are visible in the [Git history](https://github.com/fishnchips2026/vltg).

---

## Contact

For privacy questions, reach out via [GitHub](https://github.com/fishnchips2026/vltg/issues).
