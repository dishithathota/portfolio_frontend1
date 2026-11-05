import { useState } from 'react';
import { Field, Alert } from './ui.jsx';
import { read, write, uid, log } from '../utils/storage.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Contact() {
  const { user } = useAuth();
  const [f, setF] = useState({ name: user?.name || '', email: user?.email || '', message: '' });
  const [errs, setErrs] = useState({});
  const [ok, setOk] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (f.name.trim().length < 2) er.name = 'Enter your name.';
    if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = 'Enter a valid email.';
    if (f.message.trim().length < 10) er.message = 'Message must be at least 10 characters.';
    setErrs(er); setOk(false);
    if (Object.keys(er).length) return;
    write('messages', [{ id: uid(), ...f, read: false, at: Date.now() }, ...read('messages', [])]);
    if (user) log(user.id, 'Sent a contact message');
    setF({ ...f, message: '' }); setOk(true);
  };
  return (
    <form className="card form" onSubmit={submit} noValidate>
      <Alert type="success">{ok && 'Thanks! Your message was sent.'}</Alert>
      <Field label="Name" value={f.name} onChange={set('name')} error={errs.name} />
      <Field label="Email" type="email" value={f.email} onChange={set('email')} error={errs.email} />
      <Field label="Message" textarea value={f.message} onChange={set('message')} error={errs.message} />
      <button className="btn">Send message</button>
    </form>
  );
}
