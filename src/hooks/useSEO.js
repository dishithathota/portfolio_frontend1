import { useEffect } from 'react';
// Sets per-page title and meta description for SEO.
export default function useSEO(title, description) {
  useEffect(() => {
    document.title = `${title} | FolioHub`;
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.name = 'description'; document.head.appendChild(m); }
    if (description) m.content = description;
  }, [title, description]);
}
