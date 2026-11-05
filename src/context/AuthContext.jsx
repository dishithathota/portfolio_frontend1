import { createContext, useContext, useState } from 'react';
import { read, write, uid, log } from '../utils/storage.js';

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);
export const ADMIN_CODE = 'FOLIO-ADMIN';

export function AuthProvider({ children }) {
  const [users, setUsersState] = useState(() => read('users', []));
  const [sid, setSid] = useState(() => read('session', null));
  const user = users.find((u) => u.id === sid) || null;

  const setUsers = (list) => { setUsersState(list); write('users', list); };

  const signup = ({ name, email, password, role }) => {
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) return { ok: false, msg: 'This email is already registered.' };
    const u = { id: uid(), name, email, password, role, bio: '', location: '', website: '', saved: [], created: Date.now() };
    setUsers([...users, u]);
    log(u.id, 'Created an account');
    return { ok: true };
  };
  const login = (email, password) => {
    const u = users.find((x) => x.email.toLowerCase() === email.toLowerCase() && x.password === password);
    if (!u) return { ok: false, msg: 'Invalid email or password.' };
    write('session', u.id); setSid(u.id); log(u.id, 'Logged in');
    return { ok: true, user: u };
  };
  const logout = () => { localStorage.removeItem('foliohub_session'); setSid(null); };
  const updateProfile = (patch) => { setUsers(users.map((u) => (u.id === sid ? { ...u, ...patch } : u))); };

  return <Ctx.Provider value={{ user, users, setUsers, signup, login, logout, updateProfile }}>{children}</Ctx.Provider>;
}
