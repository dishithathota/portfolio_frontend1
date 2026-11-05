import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search, Layers } from 'lucide-react';
import { Field, Alert, Empty, Modal } from '../../components/ui.jsx';
import { CFG } from '../../utils/config.js';
import { read, write, uid, fmt } from '../../utils/storage.js';
import useSEO from '../../hooks/useSEO.js';

export default function AdminItems({ type }) {
  const c = CFG[type];
  useSEO(`Manage ${c.label}`);
  const blank = { title: '', cat: c.cats[0], summary: '', body: '', ...Object.fromEntries(c.extra.map((x) => [x.k, ''])) };
  const [items, setItems] = useState(() => read(type, []));
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const [edit, setEdit] = useState(null);
  const [errs, setErrs] = useState({});
  const [note, setNote] = useState('');
  const save = (list) => { setItems(list); write(type, list); };
  const open = (it) => { setErrs({}); setEdit(it ? { ...it } : { ...blank }); };
  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (!edit.title.trim()) er.title = 'Title is required.';
    if (!edit.summary.trim()) er.summary = 'Summary is required.';
    if (edit.body.trim().length < 10) er.body = 'Details must be at least 10 characters.';
    setErrs(er);
    if (Object.keys(er).length) return;
    if (edit.id) { save(items.map((i) => (i.id === edit.id ? edit : i))); setNote(`${c.one} updated.`); }
    else { save([{ ...edit, id: uid(), created: Date.now(), ...(type === 'projects' ? { modules: [] } : {}) }, ...items]); setNote(`${c.one} added.`); }
    setEdit(null);
  };
  const del = (i) => { if (window.confirm(`Delete "${i.title}"?`)) { save(items.filter((x) => x.id !== i.id)); setNote(`${c.one} deleted.`); } };
  const shown = items.filter((i) => (cat === 'All' || i.cat === cat) && i.title.toLowerCase().includes(q.toLowerCase()));
  const set = (k) => (e) => setEdit({ ...edit, [k]: e.target.value });

  return (
    <>
      <div className="row between"><div><h1>Manage {c.label}</h1><p className="muted">{items.length} total</p></div><button className="btn" onClick={() => open()}><Plus size={16} /> Add {c.one}</button></div>
      <Alert type="success">{note}</Alert>
      <div className="row toolbar">
        <div className="search"><Search size={16} /><input placeholder="Search by title…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <select value={cat} onChange={(e) => setCat(e.target.value)}><option>All</option>{c.cats.map((x) => <option key={x}>{x}</option>)}</select>
      </div>
      <div className="card tablewrap">{shown.length === 0 ? <Empty text="No records match." /> :
        <table><thead><tr><th>Title</th><th>Category</th><th>Created</th><th /></tr></thead><tbody>
          {shown.map((i) => <tr key={i.id}><td><b>{i.title}</b><br /><small className="muted">{i.summary}</small></td><td><span className="tag">{i.cat}</span></td><td>{fmt(i.created)}</td>
            <td className="actions">{type === 'projects' && <Link className="icon" to={`/admin/projects/${i.id}`} title="Modules & tasks" aria-label="Modules"><Layers size={16} /></Link>}<button className="icon" onClick={() => open(i)} aria-label="Edit"><Pencil size={16} /></button><button className="icon danger" onClick={() => del(i)} aria-label="Delete"><Trash2 size={16} /></button></td></tr>)}
        </tbody></table>}</div>
      {edit && <Modal title={`${edit.id ? 'Edit' : 'Add'} ${c.one}`} onClose={() => setEdit(null)}>
        <form onSubmit={submit} noValidate className="form">
          <Field label="Title" value={edit.title} onChange={set('title')} error={errs.title} />
          <Field label="Category" select options={c.cats} value={edit.cat} onChange={set('cat')} />
          <Field label="Short summary" value={edit.summary} onChange={set('summary')} error={errs.summary} />
          <Field label="Details" textarea value={edit.body} onChange={set('body')} error={errs.body} />
          {c.extra.map((x) => <Field key={x.k} label={x.label} value={edit[x.k] || ''} onChange={set(x.k)} />)}
          <button className="btn">Save</button>
        </form></Modal>}
    </>
  );
}
