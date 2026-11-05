import Contact from '../../components/Contact.jsx';
import useSEO from '../../hooks/useSEO.js';
export default function UserContact() {
  useSEO('Contact');
  return <><h1>Contact the owner</h1><div className="narrow"><Contact /></div></>;
}
