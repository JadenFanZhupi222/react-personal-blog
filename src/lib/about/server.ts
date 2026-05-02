import { cacheLife, cacheTag } from 'next/cache';
import { dbConnect } from '@/lib/db';
import Skills from '@/models/Skills';
import Experiences from '@/models/Experiences';
import { parseAboutData } from './parser';
import type { AboutData, RawSkillsData, RawExperiencesData } from './types';

export async function getAboutData(): Promise<AboutData> {
  'use cache';
  cacheLife('hours');
  cacheTag('about');
  await dbConnect();
  const [skills, experiences] = await Promise.all([
    Skills.find({}, { _id: 0, __v: 0 }).lean<RawSkillsData[]>(),
    Experiences.find({}, { _id: 0, __v: 0 }).lean<RawExperiencesData[]>(),
  ]);
  return parseAboutData({ skills, experiences });
}
