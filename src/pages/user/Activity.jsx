import { Empty } from '../../components/ui.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { read, fmt } from '../../utils/storage.js';
import useSEO from '../../hooks/useSEO.js';

export default function Activity() {
  useSEO('My Activity');
  const { user } = useAuth();
  const acts = read('activity', []).filter((a) => a.userId === user.id);
  return (
    <>
      <h1>My Activity</h1>
      <div className="card">{acts.length === 0 ? <Empty text="No activity yet." /> :
        <ul className="timeline">{acts.map((a) => <li key={a.id}><b>{a.text}</b><small className="muted">{fmt(a.at)}</small></li>)}</ul>}</div>
    </>
  );
}
