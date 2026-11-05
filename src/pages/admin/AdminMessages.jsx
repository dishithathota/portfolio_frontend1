import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Empty } from '../../components/ui.jsx';
import { read, write, fmt } from '../../utils/storage.js';
import useSEO from '../../hooks/useSEO.js';

export default function AdminMessages() {
  useSEO('Contact Messages');
  const [msgs, setMsgs] = useState(() => read('messages', []));
  const save = (l) => { setMsgs(l); write('messages', l); };
  return (
    <>
      <h1>Contact Messages</h1>
      {msgs.length === 0 ? <div className="card"><Empty text="No messages received yet." /></div> :
        msgs.map((m) => <div key={m.id} className={`card msg ${m.read ? '' : 'unread'}`}>
          <div className="row between"><div><b>{m.name}</b> <small className="muted">{m.email} · {fmt(m.at)}</small></div>
            <div className="actions">{!m.read && <button className="btn sm" onClick={() => save(msgs.map((x) => (x.id === m.id ? { ...x, read: true } : x)))}>Mark read</button>}
              <button className="icon danger" aria-label="Delete" onClick={() => save(msgs.filter((x) => x.id !== m.id))}><Trash2 size={16} /></button></div></div>
          <p>{m.message}</p></div>)}
    </>
  );
}
