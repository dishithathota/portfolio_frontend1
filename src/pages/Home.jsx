import { Link } from 'react-router-dom';
import { read } from '../utils/storage.js';
import { Thumb } from '../components/ui.jsx';
import Contact from '../components/Contact.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { home } from '../routes/ProtectedRoute.jsx';
import useSEO from '../hooks/useSEO.js';

export default function Home() {
  useSEO('Personal Portfolio Platform', 'FolioHub: project gallery, blog and contact form to showcase your skills to employers and clients.');
  const { user } = useAuth();
  const projects = read('projects', []).slice(0, 4);
  const posts = read('posts', []).slice(0, 3);
  return (
    <div className="public">
      <header className="pnav"><b className="brand dark">◆ FolioHub</b>
        <nav><a href="#projects">Projects</a><a href="#blog">Blog</a><a href="#contact">Contact</a>
          {user ? <Link className="btn sm" to={home(user)}>Dashboard</Link> : <><Link to="/login">Login</Link><Link className="btn sm" to="/signup">Sign up</Link></>}</nav></header>
      <section className="hero"><h1>Hi, I build things for the web.</h1><p>A personal portfolio platform to present projects, write articles and get hired.</p>
        <a className="btn" href="#projects">View my work</a></section>
      <section id="projects" className="sec"><h2>Featured Projects</h2>
        <div className="grid">{projects.map((p) => <article key={p.id} className="card item"><Thumb cat={p.cat} /><span className="tag">{p.cat}</span><h3>{p.title}</h3><p>{p.summary}</p><small>{p.tech}</small></article>)}</div></section>
      <section id="blog" className="sec"><h2>Latest Articles</h2>
        <div className="grid">{posts.map((p) => <article key={p.id} className="card item"><span className="tag">{p.cat}</span><h3>{p.title}</h3><p>{p.summary}</p></article>)}</div>
        <p className="muted"><Link to="/signup">Create a free account</Link> to read full articles and save projects.</p></section>
      <section id="contact" className="sec narrow"><h2>Get in touch</h2><Contact /></section>
      <footer className="foot">© {new Date().getFullYear()} FolioHub · Academic demo project</footer>
    </div>
  );
}
