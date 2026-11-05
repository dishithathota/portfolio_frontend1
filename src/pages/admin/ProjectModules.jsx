import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ModuleBoard from '../../components/ModuleBoard.jsx';
import { Empty } from '../../components/ui.jsx';
import { read, write } from '../../utils/storage.js';
import useSEO from '../../hooks/useSEO.js';

export default function ProjectModules() {
  const { id } = useParams();
  const [project, setProject] = useState(() => read('projects', []).find((p) => p.id === id));
  useSEO(project ? `${project.title} modules` : 'Project not found');
  if (!project) return <div className="card"><Empty text="Project not found." /><Link to="/admin/projects">← Back</Link></div>;
  const save = (p) => { setProject(p); write('projects', read('projects', []).map((x) => (x.id === p.id ? p : x))); };
  return (
    <>
      <Link to="/admin/projects">← Back to projects</Link>
      <h1>{project.title}</h1><p className="muted">{project.summary}</p>
      <ModuleBoard project={project} editable onChange={save} />
    </>
  );
}
