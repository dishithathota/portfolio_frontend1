// Centralised Local Storage helpers + first-run seed data.
const P = 'foliohub_';
export const read = (k, d) => {
  try { const v = localStorage.getItem(P + k); return v ? JSON.parse(v) : d; } catch { return d; }
};
export const write = (k, v) => { try { localStorage.setItem(P + k, JSON.stringify(v)); } catch { /* storage full/blocked */ } };
export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
export const fmt = (t) => new Date(t).toLocaleString();
export const log = (userId, text) => write('activity', [{ id: uid(), userId, text, at: Date.now() }, ...read('activity', [])]);

export function seed() {
  if (read('users', null)) return;
  const now = Date.now();
  write('users', [
    { id: 'u-admin', name: 'Portfolio Admin', email: 'admin@foliohub.com', password: 'Admin@123', role: 'admin', bio: 'Site owner', location: '', website: '', saved: [], created: now },
    { id: 'u-demo', name: 'Demo User', email: 'user@foliohub.com', password: 'User@123', role: 'user', bio: 'Recruiter exploring the portfolio', location: 'India', website: '', saved: [], created: now },
  ]);
  write('projects', [
    { id: 'p1', title: 'TaskFlow Dashboard', cat: 'Web', summary: 'Kanban-style productivity app with drag and drop.', body: 'A responsive task manager built with React and Context API. Features boards, labels, deadlines and persistent storage.', tech: 'React, Vite, CSS', link: 'https://github.com/', created: now },
    { id: 'p2', title: 'FitTrack Mobile', cat: 'Mobile', summary: 'Workout and nutrition tracker UI.', body: 'Mobile-first fitness tracker with charts, streaks and goal setting. Designed with accessibility in mind.', tech: 'React Native, Expo', link: 'https://github.com/', created: now },
    { id: 'p3', title: 'Sentiment Analyzer', cat: 'AI/ML', summary: 'NLP model classifying product reviews.', body: 'Trained a text classifier on review data and exposed results through a simple UI with confidence scores.', tech: 'Python, scikit-learn', link: 'https://github.com/', created: now },
    { id: 'p4', title: 'Brand Identity Kit', cat: 'Design', summary: 'Logo, colour system and UI kit for a startup.', body: 'Complete visual identity including typography scale, component library and style guide.', tech: 'Figma', link: 'https://github.com/', created: now },
  ]);
  write('posts', [
    { id: 'b1', title: 'How I Structure React Projects', cat: 'Tutorial', summary: 'Folder layout that scales.', body: 'Group by feature, keep utilities centralised, and separate layouts from pages. This keeps large apps maintainable.', created: now },
    { id: 'b2', title: 'Landing My First Internship', cat: 'Career', summary: 'What worked during applications.', body: 'Build real projects, document them well, and keep your portfolio updated. Recruiters value clarity over volume.', created: now },
    { id: 'b3', title: 'SEO Basics for Portfolios', cat: 'Tutorial', summary: 'Titles, descriptions and semantic HTML.', body: 'Use unique titles and meta descriptions per page, semantic headings, descriptive links and a sitemap.', created: now },
  ]);
  write('messages', []);
  write('activity', []);
}
seed();

// ---- Project modules & tasks (added in v1.1) ----
const tpl = (done) => {
  const groups = [['Planning & Design', ['Gather requirements', 'Create wireframes', 'Finalize design system']], ['Development', ['Set up project', 'Build core features', 'Integrate data storage', 'Add responsive styles']], ['Testing & Release', ['Test all flows', 'Fix bugs', 'Deploy and document']]];
  let n = 0;
  return groups.map(([name, t]) => ({ id: uid(), name, desc: '', tasks: t.map((title) => ({ id: uid(), title, done: n++ < done })) }));
};
export function ensureModules() {
  const ps = read('projects', []);
  if (!ps.some((p) => !p.modules)) return;
  write('projects', ps.map((p, i) => (p.modules ? p : { ...p, modules: tpl([8, 4, 10, 10][i] ?? 0) })));
}
ensureModules();
