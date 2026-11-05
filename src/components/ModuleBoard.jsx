import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { uid } from '../utils/storage.js';
import { Empty } from './ui.jsx';

export const tally = (tasks) => {
  const total = tasks.length, done = tasks.filter((t) => t.done).length;
  return { total, done, left: total - done, pct: total ? Math.round((done / total) * 100) : 0 };
};

// Task dashboard: how many tasks are done / left.
export function TaskDashboard({ tasks, title = 'Task dashboard' }) {
  const s = tally(tasks);
  return (
    <div className="tdash">
      <div className="row between"><b>{title}</b><span className="tag">{s.pct}%</span></div>
      <div className="bar"><div style={{ width: `${s.pct}%` }} /></div>
      <div className="tcounts"><span className="done">✔ {s.done} done</span><span className="left">⏳ {s.left} left</span><span>{s.total} total</span></div>
    </div>
  );
}

const Donut = ({ pct }) => (
  <svg viewBox="0 0 100 100" className="donut" aria-label={`${pct}% complete`}>
    <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="12" />
    <circle cx="50" cy="50" r="40" fill="none" stroke="var(--p,#4f46e5)" strokeWidth="12" strokeLinecap="round" strokeDasharray={`${(pct / 100) * 251.2} 251.2`} transform="rotate(-90 50 50)" />
    <text x="50" y="56" textAnchor="middle" fontSize="20" fontWeight="700" fill="currentColor">{pct}%</text>
  </svg>
);

export default function ModuleBoard({ project, editable = false, onChange }) {
  const mods = project.modules || [];
  const s = tally(mods.flatMap((m) => m.tasks));
  const [name, setName] = useState('');
  const [draft, setDraft] = useState({});
  const upd = (fn) => onChange({ ...project, modules: fn(mods) });
  const addModule = (e) => { e.preventDefault(); if (!name.trim()) return; upd((m) => [...m, { id: uid(), name: name.trim(), desc: '', tasks: [] }]); setName(''); };
  const addTask = (e, mid) => { e.preventDefault(); const t = (draft[mid] || '').trim(); if (!t) return; upd((m) => m.map((x) => (x.id === mid ? { ...x, tasks: [...x.tasks, { id: uid(), title: t, done: false }] } : x))); setDraft({ ...draft, [mid]: '' }); };
  const toggle = (mid, tid) => upd((m) => m.map((x) => (x.id === mid ? { ...x, tasks: x.tasks.map((t) => (t.id === tid ? { ...t, done: !t.done } : t)) } : x)));
  const delTask = (mid, tid) => upd((m) => m.map((x) => (x.id === mid ? { ...x, tasks: x.tasks.filter((t) => t.id !== tid) } : x)));
  const delModule = (m) => window.confirm(`Delete module "${m.name}" and its tasks?`) && upd((l) => l.filter((x) => x.id !== m.id));

  return (
    <section className="modboard">
      <h3>Project Modules</h3>
      <div className="card overall">
        <Donut pct={s.pct} />
        <div className="ostats"><b>Overall task dashboard</b>
          <div className="tcounts big"><span className="done">✔ {s.done} done</span><span className="left">⏳ {s.left} left</span><span>{s.total} total tasks</span></div>
          <small>{mods.length} module{mods.length === 1 ? '' : 's'} in this project</small></div>
      </div>
      {mods.length === 0 && <div className="card"><Empty text="No modules in this project yet." /></div>}
      <div className="modgrid">
        {mods.map((m) => (
          <div key={m.id} className="card mod">
            <div className="row between"><h4>{m.name}</h4>{editable && <button className="icon danger" aria-label="Delete module" onClick={() => delModule(m)}><Trash2 size={16} /></button>}</div>
            <TaskDashboard tasks={m.tasks} title="Module tasks" />
            <ul className="tasks">
              {m.tasks.length === 0 && <li className="muted">No tasks yet.</li>}
              {m.tasks.map((t) => (
                <li key={t.id} className={t.done ? 'isdone' : ''}>
                  <label><input type="checkbox" checked={t.done} disabled={!editable} onChange={() => toggle(m.id, t.id)} /> <span>{t.title}</span></label>
                  {editable && <button className="icon danger" aria-label="Delete task" onClick={() => delTask(m.id, t.id)}><Trash2 size={14} /></button>}
                </li>
              ))}
            </ul>
            {editable && <form className="row addrow" onSubmit={(e) => addTask(e, m.id)}><input placeholder="Add a task…" value={draft[m.id] || ''} onChange={(e) => setDraft({ ...draft, [m.id]: e.target.value })} /><button className="btn sm"><Plus size={14} /> Add</button></form>}
          </div>
        ))}
      </div>
      {editable && <form className="card row addrow" onSubmit={addModule}><input placeholder="New module name (e.g. Payments)" value={name} onChange={(e) => setName(e.target.value)} /><button className="btn"><Plus size={16} /> Add module</button></form>}
    </section>
  );
}
