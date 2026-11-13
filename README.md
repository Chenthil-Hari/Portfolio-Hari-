# Chenthil Hari — Engineering Portfolio (`haritech.me`)

> Modern, Swiss-inspired engineering portfolio showcasing embedded microcontroller firmware, algorithm simulations, and full-stack web software.

## Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend / Serverless:** Vercel Serverless Functions (`/api`), Node.js runtime.
- **Database:** MongoDB Atlas (Persistent contact submissions and visitor guestbook).
- **Email:** Resend API with automated `.ics` calendar invitation generation and transactional dispatch.
- **Design System:** Swiss Engineering / Minimalist Editorial (Restrained palette, high typographic hierarchy, zero generic purple blobs or AI card clichés).

---

## Getting Started

### 1. Prerequisites
- Node.js 18+
- npm or pnpm

### 2. Environment Variables
Copy the template configuration:
```bash
cp .env.example .env.local
```
Fill in your credentials:
```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/portfolio
RESEND_API_KEY=re_your_api_key_here
OWNER_EMAIL=chenthilhari@gmail.com
ADMIN_PASSWORD=your_secure_admin_password
```

### 3. Install & Run Dev Server
```bash
npm install
npm run dev
```
Visit `http://localhost:5173` in your browser.

---

## Build & Production Verification

```bash
# Typecheck and build static production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## Deployment

The repository is configured for direct deployment on **Vercel**:
- `vercel.json` applies HTTP security headers (CSP, HSTS, X-Frame-Options, Permissions-Policy).
- Serverless API routes under `/api/*` run in isolated Node.js functions.
- Static assets are generated into `/dist`.

For detailed security findings and mitigations, refer to [SECURITY_AUDIT.md](./SECURITY_AUDIT.md).
