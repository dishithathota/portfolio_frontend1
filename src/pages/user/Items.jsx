import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Empty, Loader, Thumb } from '../../components/ui.jsx';
import { CFG } from '../../utils/config.js';
import { read } from '../../utils/storage.js';
import useSEO from '../../hooks/useSEO.js';

export default function Items({ type }) {
  const c = CFG[type];
  const base = type === 'projects' ? '/user/projects' : '/user/blog';
  useSEO(c.label);
  const [data, setData] = useState(null);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  useEffect(() => { setData(null); const t = setTimeout(() => setData(read(type, [])), 300); return () => clearTimeout(t); }, [type]);
  if (!data) return <Loader />;
  const shown = data.filter((i) => (cat === 'All' || i.cat === cat) && (i.title + i.summary).toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <h1>{c.label}</h1>
      <div className="row toolbar"><div className="search"><Search size={16} /><input placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <select value={cat} onChange={(e) => setCat(e.target.value)}><option>All</option>{c.cats.map((x) => <option key={x}>{x}</option>)}</select></div>
      {shown.length === 0 ? <div className="card"><Empty text="No results found." /></div> :
        <div className="grid">{shown.map((i) => <Link key={i.id} to={`${base}/${i.id}`} className="card item">{type === 'projects' && <Thumb cat={i.cat} />}<span className="tag">{i.cat}</span><h3>{i.title}</h3><p>{i.summary}</p></Link>)}</div>}
    </>
  );
}
