import { FolderKanban, FileText, Users, Mail } from 'lucide-react';
import { Stat } from '../../components/ui.jsx';
import { read, fmt } from '../../utils/storage.js';
import { useAuth } from '../../context/AuthContext.jsx';
import useSEO from '../../hooks/useSEO.js';

export default function AdminOverview() {
  useSEO('Admin Overview');
  const { users } = useAuth();
  const msgs = read('messages', []);
  return (
    <>
      <h1>Admin Overview</h1><p className="muted">Manage the entire portfolio platform.</p>
      <div className="stats">
        <Stat label="Projects" value={read('projects', []).length} icon={<FolderKanban />} />
        <Stat label="Blog posts" value={read('posts', []).length} icon={<FileText />} />
        <Stat label="Registered users" value={users.length} icon={<Users />} />
        <Stat label="Unread messages" value={msgs.filter((m) => !m.read).length} icon={<Mail />} />
      </div>
      <div className="two">
        <div className="card"><h3>Recent users</h3><table><thead><tr><th>Name</th><th>Role</th></tr></thead><tbody>
          {users.slice(-5).reverse().map((u) => <tr key={u.id}><td>{u.name}</td><td><span className="tag">{u.role}</span></td></tr>)}</tbody></table></div>
        <div className="card"><h3>Recent messages</h3>{msgs.length === 0 ? <p className="muted">No messages yet.</p> :
          msgs.slice(0, 4).map((m) => <p key={m.id}><b>{m.name}</b>: {m.message.slice(0, 60)}<br /><small className="muted">{fmt(m.at)}</small></p>)}</div>
      </div>
    </>
  );
}
