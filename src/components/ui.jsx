import { ICON, HUE } from '../utils/config.js';
import { X } from 'lucide-react';

export const Field = ({ label, error, textarea, select, options = [], ...p }) => (
  <label className="field">
    <span>{label}</span>
    {select ? <select {...p}>{options.map((o) => <option key={o}>{o}</option>)}</select>
      : textarea ? <textarea rows="4" {...p} /> : <input {...p} />}
    {error && <small className="err">{error}</small>}
  </label>
);
export const Alert = ({ type = 'error', children }) => (children ? <div className={`alert ${type}`}>{children}</div> : null);
export const Empty = ({ text = 'Nothing here yet.' }) => <div className="empty">📭<p>{text}</p></div>;
export const Loader = () => <div className="loader"><div className="spin" /></div>;
export const Thumb = ({ cat }) => (
  <div className="thumb" style={{ background: `linear-gradient(135deg,hsl(${HUE[cat] || 220},80%,60%),hsl(${(HUE[cat] || 220) + 40},70%,45%))` }}>{ICON[cat] || '✨'}</div>
);
export const Modal = ({ title, onClose, children }) => (
  <div className="overlay" onClick={onClose}>
    <div className="modal" onClick={(e) => e.stopPropagation()}>
      <div className="row between"><h3>{title}</h3><button className="icon" onClick={onClose} aria-label="Close"><X size={18} /></button></div>
      {children}
    </div>
  </div>
);
export const Stat = ({ label, value, icon }) => (
  <div className="card stat"><span className="statico">{icon}</span><div><b>{value}</b><small>{label}</small></div></div>
);
