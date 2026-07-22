import { notFound } from 'next/navigation';
import ContactPage from '@/components/contact';
import { getContactData } from '@/lib/contact/server';

export default async function Contact() {
  const contact = await getContactData();
  if (!contact) notFound();
  return <ContactPage contact={contact} />;
}
