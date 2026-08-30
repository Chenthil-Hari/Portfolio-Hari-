# Portfolio — Hari

A premium, highly animated personal portfolio website built with React, TypeScript, Tailwind CSS, and Framer Motion.

## ✨ Features

- Dark premium glassmorphism design
- Smooth Framer Motion animations throughout
- Custom cursor with magnetic effects (desktop)
- Canvas particle background
- Scroll-triggered section reveals
- GitHub API integration (real repo data)
- Fully responsive (mobile → desktop)
- Accessible (prefers-reduced-motion support)
- All content editable from a single data file

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## 📁 Updating Content

All portfolio data lives in **`src/data/portfolio.ts`**. Edit that file to update:

- Personal info, email, GitHub, LinkedIn
- Projects (title, description, technologies, links)
- Skills
- Experience timeline
- Education
- Achievements / certifications

## 📄 Resume

Drop your `resume.pdf` into the `public/` folder. The Download Resume button will automatically work.

## 🔗 Email Contact Form

The contact form shows a success animation but does **not** send real emails by default.
To enable real email delivery, integrate:
- [Formspree](https://formspree.io/) — replace the form `onSubmit` handler
- [EmailJS](https://www.emailjs.com/) — add the EmailJS SDK

## 🏗️ Build for Production

```bash
npm run build
npm run preview
```

## 📦 Tech Stack

| Tool | Purpose |
|---|---|
| React 18 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Lucide React | Icons |
| GitHub REST API | Live repo data |
