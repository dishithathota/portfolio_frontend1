# FolioHub — Personal Portfolio Platform (React + Vite)

A personal portfolio platform to showcase skills, projects and achievements. It has a project gallery, blog, contact form and SEO optimisation (per-page titles/meta descriptions, semantic HTML, `robots.txt`, `sitemap.xml`, Open Graph tags). Includes role-based Admin and User dashboards. 100% frontend: data lives in browser Local Storage.

## Technologies
React 18, Vite 5, JavaScript (JSX), CSS3, React Hooks + Context, React Router DOM 6, Local Storage, Lucide React icons.

## Folder structure
```
src/
  components/  reusable UI (Field, Modal, Stat, Contact...)
  context/     AuthContext (signup/login/session/profile)
  hooks/       useSEO (title + meta description)
  layouts/     Shell (sidebar layout for admin & user)
  pages/       Home, Auth, admin/*, user/*
  routes/      ProtectedRoute (role-based access)
  utils/       storage.js (Local Storage + seed data), config.js
  App.jsx  main.jsx  index.css
public/        favicon, robots.txt, sitemap.xml
vercel.json    SPA rewrite for React Router
```

## Setup
1. Install Node.js (LTS) from https://nodejs.org and verify: `node -v` and `npm -v`.
2. Unzip the project, open the folder in VS Code (`File > Open Folder`), open the terminal (`Ctrl+``).
3. Install: `npm install`
4. Run dev server: `npm run dev` (open http://localhost:5173)
5. Build: `npm run build`
6. Preview production build: `npm run preview`

## Demo credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@foliohub.com | Admin@123 |
| User | user@foliohub.com | User@123 |

Signing up as **admin** requires the invite code `FOLIO-ADMIN` (demo only).

## Features
- **Admin:** overview stats, CRUD for projects and blog posts, search/filter, view/delete users, inbox for contact messages.
- **User:** welcome dashboard, browse/search/filter projects and blog, detail pages, save projects, edit profile, activity history, contact form.
- Protected routes and role-based redirects; loading, empty and error states; responsive layout.

## How Local Storage authentication works
Users are saved in `localStorage` (`foliohub_users`). On login, the entered credentials are compared with stored users and the user id is saved as the session (`foliohub_session`). Protected routes read the session and role from context. **This is for academic demonstration only and is NOT secure**: passwords are stored in plain text in the browser and anyone can edit Local Storage. Real apps need a server, password hashing and secure tokens.

## Upload to GitHub
```
git init
git add .
git commit -m "Initial commit: FolioHub"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo>.git
git push -u origin main
```
(Create the empty repo on github.com first. `node_modules` and `dist` are git-ignored.)

## Deploy on Vercel
1. Push to GitHub. 2. Go to https://vercel.com > Add New > Project > import the repo.
3. Framework preset: Vite (build `npm run build`, output `dist`). 4. Click Deploy.
`vercel.json` rewrites all routes to `index.html` so refreshing `/admin` or `/user/profile` works.
