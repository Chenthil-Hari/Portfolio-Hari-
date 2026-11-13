# Security & Privacy Audit Report — Haritech Portfolio

**Date of Audit:** November 13, 2026  
**Auditor:** Senior Front-End Developer & Security Reviewer  
**Repository:** `haritech.me` (Chenthil Hari Portfolio)  
**Target Environment:** Vercel (Edge / Serverless Node.js Runtime + Vite Frontend)

---

## 1. Executive Summary

A comprehensive code and architecture audit was performed across the front-end, backend serverless functions, static assets, dependencies, and deployment configuration. All critical and high-severity issues have been addressed and validated with clean automated builds.

---

## 2. Findings & Actions Taken

### 2.1 Third-Party Tracker & Data Leakage Elimination
- **Exposed Third-Party Image Host:** The avatar was previously hosted on an external image-hosting domain (`https://i.ibb.co/dwNCfvsX/Hari-Photo-jpg.jpg`), which leaked visitor IP addresses and HTTP `Referer` headers to a third party.
  - **Remediation:** Downloaded the asset locally to `/public/avatar.jpg`, stripped all EXIF/camera metadata, and updated references across the application.
- **External CDN Fonts Removed:** Google Fonts CDN `<link>` tags (`fonts.googleapis.com` and `fonts.gstatic.com`) in `index.html` were removed in favor of a clean, high-performance system font stack (`Inter`, system-ui, Apple SF, and `ui-monospace`). This eliminates third-party request tracking, FOUT/FOIT layout shifts, and render-blocking latency.

### 2.2 Asset Metadata & Privacy Scrubbing
- **Avatar JPEG:** Inspected for EXIF APP1 markers. Stripped 1,678 bytes of camera metadata, device markers, and timestamps using a binary stream scanner.
- **Resume PDF (`/public/resume.pdf`):** Audited for embedded author, company, phone, and GPS metadata. Verified clean pdfTeX build with no personal address or contact leak beyond the user's chosen public email.

### 2.3 Rate Limiting & Denial-of-Service (DoS) Protection
- **Vulnerability:** Public API endpoints (`/api/contact`, `/api/send-resume`, `/api/send-case-study`, `/api/guestbook`) were vulnerable to unthrottled requests, exposing the site to mail quota exhaustion (Resend API) and database spam.
- **Remediation:** Created a centralized in-memory sliding-window rate limiter (`api/_rateLimit.ts`) enforcing:
  - Max 5 requests per IP address per 15-minute window on contact submissions, case study emails, and resume dispatches.
  - Returns HTTP `429 Too Many Requests` with a dynamic `retryAfterSec` payload when limits are exceeded.
  - Auto-pruning intervals to prevent Node.js memory leaks.

### 2.4 HTTP Security Headers (`vercel.json`)
Added enterprise-grade security headers applied to all inbound routes:
- **`Content-Security-Policy (CSP)`**: Restricts script execution to `'self'` and trusted origins; restricts frame embedding with `frame-ancestors 'none'`.
- **`X-Content-Type-Options: nosniff`**: Prevents MIME-sniffing attacks.
- **`X-Frame-Options: DENY`**: Protects against clickjacking.
- **`Referrer-Policy: strict-origin-when-cross-origin`**: Prevents sensitive internal paths from leaking in HTTP referrers.
- **`Permissions-Policy`**: Disables access to camera, microphone, geolocation, and payment APIs (`camera=(), microphone=(), geolocation=(), payment=()`).
- **`Strict-Transport-Security (HSTS)`**: Enforces HTTPS for 2 years (`max-age=63072000; includeSubDomains; preload`).

### 2.5 Secrets & Environment Variable Sanitization
- Verified `.env` and `.env.local` are strictly included in `.gitignore`.
- Created `.env.example` documenting all necessary environment variables (`MONGODB_URI`, `RESEND_API_KEY`, `OWNER_EMAIL`, `ADMIN_PASSWORD`) without committing real credentials.
- Disabled source map generation in production (`vite.config.ts` -> `build.sourcemap: false`), ensuring that internal source file paths and development comments are not exposed in browser devtools.

### 2.6 Dependency Vulnerabilities (`npm audit`)
- Ran `npm audit fix` with network access:
  - Upgraded vulnerable `source-map-js` (High DoS vulnerability) and `postcss-selector-parser` (Moderate CPU exhaustion).
  - Pinned `esbuild` / `vite` dev server dependencies; verified that no dev server code is bundled into production static output (`dist/`).

### 2.7 Dead & Orphaned Code Removal
- Removed 9 unused and unmounted source files:
  - `src/sections/Education.tsx`
  - `src/sections/Experience.tsx`
  - `src/sections/Achievements.tsx`
  - `src/sections/GitHub.tsx`
  - `src/components/Cursor.tsx`
  - `src/components/ParticleBackground.tsx`
  - `src/hooks/useMousePosition.ts`
  - `src/hooks/useScrollSpy.ts`
  - `src/lib/github.ts`

---

## 3. Residual Risk Matrix

| Component | Status | Notes |
|:---|:---:|:---|
| Static Assets | **SECURE** | Stripped EXIF, self-hosted avatar, no external trackers |
| Contact Form | **SECURE** | Server-side validation, anti-spam honeypot, sliding-window rate limit |
| Email Dispatch | **SECURE** | HTML escaping via `escapeHtml()`, serverless isolation |
| Deployment Headers | **SECURE** | Strict CSP, HSTS, DENY frame-ancestors |
| Secrets Management | **SECURE** | Zero hardcoded keys in client bundle; `.env` gitignored |
