import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Empty, Thumb } from '../../components/ui.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { read, log } from '../../utils/storage.js';
import { CFG } from '../../utils/config.js';
import ModuleBoard from '../../components/ModuleBoard.jsx';
import useSEO from '../../hooks/useSEO.js';

export default function Detail({ type }) {
  const { id } = useParams();
  const { user, updateProfile } = useAuth();
  const item = read(type, []).find((i) => i.id === id);
  const back = type === 'projects' ? '/user/projects' : '/user/blog';
  useSEO(item ? item.title : 'Not found', item?.summary);
  useEffect(() => { if (item) log(user.id, `Viewed ${CFG[type].one.toLowerCase()}: ${item.title}`); }, [id]); // eslint-disable-line
  if (!item) return <div className="card"><Empty text="This item no longer exists." /><Link to={back}>← Back</Link></div>;
  const saved = user.saved.includes(item.id);
  const toggle = () => {
    updateProfile({ saved: saved ? user.saved.filter((s) => s !== item.id) : [...user.saved, item.id] });
    log(user.id, `${saved ? 'Unsaved' : 'Saved'} project: ${item.title}`);
  };
  return (
    <div className="card detail">
      <Link to={back}>← Back</Link>
      {type === 'projects' && <Thumb cat={item.cat} />}
      <span className="tag">{item.cat}</span><h1>{item.title}</h1><p className="lead">{item.summary}</p><p>{item.body}</p>
      {item.tech && <p><b>Tech:</b> {item.tech}</p>}
      {item.link && <p><a href={item.link} target="_blank" rel="noreferrer">Open link ↗</a></p>}
      {type === 'projects' && <ModuleBoard project={item} />}
      {type === 'projects' && <button className={saved ? 'btn ghost' : 'btn'} onClick={toggle}><Heart size={16} /> {saved ? 'Saved' : 'Save project'}</button>}
    </div>
  );
}
