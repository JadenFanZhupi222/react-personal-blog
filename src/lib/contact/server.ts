import { cacheLife, cacheTag } from 'next/cache';
import { dbConnect } from '@/lib/db';
import ContactModel from '@/models/Contact';
import type { ContactData } from './types';

export async function getContactData(): Promise<ContactData | null> {
  'use cache';
  cacheLife('hours');
  cacheTag('contact');
  await dbConnect();
  return (await ContactModel.findOne({}, { _id: 0, __v: 0 }).lean()) as ContactData | null;
}
