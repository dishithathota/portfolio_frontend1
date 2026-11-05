import { Link } from 'react-router-dom';
import { Heart, History, FolderKanban } from 'lucide-react';
import { Stat, Thumb } from '../../components/ui.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { read } from '../../utils/storage.js';
import useSEO from '../../hooks/useSEO.js';

export default function UserHome() {
  useSEO('Dashboard');
  const { user } = useAuth();
  const projects = read('projects', []);
  const acts = read('activity', []).filter((a) => a.userId === user.id);
  return (
    <>
      <h1>Welcome back, {user.name.split(' ')[0]} 👋</h1><p className="muted">Explore projects, read articles and reach out.</p>
      <div className="stats">
        <Stat label="Available projects" value={projects.length} icon={<FolderKanban />} />
        <Stat label="Saved projects" value={user.saved.length} icon={<Heart />} />
        <Stat label="Activities" value={acts.length} icon={<History />} />
      </div>
      <h3>Featured projects</h3>
      <div className="grid">{projects.slice(0, 3).map((p) => <Link key={p.id} to={`/user/projects/${p.id}`} className="card item"><Thumb cat={p.cat} /><span className="tag">{p.cat}</span><h3>{p.title}</h3><p>{p.summary}</p></Link>)}</div>
    </>
  );
}
