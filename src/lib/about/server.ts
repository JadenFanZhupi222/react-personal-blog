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
    Skills.find().lean() as unknown as Promise<RawSkillsData[]>,
    Experiences.find().lean() as unknown as Promise<RawExperiencesData[]>,
  ]);
  return parseAboutData({ skills, experiences });
}
