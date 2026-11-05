import { useState } from 'react';
import { Trash2, Search } from 'lucide-react';
import { Empty } from '../../components/ui.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { fmt } from '../../utils/storage.js';
import useSEO from '../../hooks/useSEO.js';

export default function AdminUsers() {
  useSEO('Registered Users');
  const { user, users, setUsers } = useAuth();
  const [q, setQ] = useState('');
  const [role, setRole] = useState('All');
  const shown = users.filter((u) => (role === 'All' || u.role === role) && (u.name + u.email).toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <h1>Registered Users</h1>
      <div className="row toolbar"><div className="search"><Search size={16} /><input placeholder="Search name or email…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <select value={role} onChange={(e) => setRole(e.target.value)}><option>All</option><option>admin</option><option>user</option></select></div>
      <div className="card tablewrap">{shown.length === 0 ? <Empty text="No users found." /> :
        <table><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th /></tr></thead><tbody>
          {shown.map((u) => <tr key={u.id}><td><b>{u.name}</b></td><td>{u.email}</td><td><span className="tag">{u.role}</span></td><td>{fmt(u.created)}</td>
            <td className="actions">{u.id !== user.id && <button className="icon danger" aria-label="Delete user" onClick={() => window.confirm(`Delete ${u.name}?`) && setUsers(users.filter((x) => x.id !== u.id))}><Trash2 size={16} /></button>}</td></tr>)}
        </tbody></table>}</div>
    </>
  );
}
