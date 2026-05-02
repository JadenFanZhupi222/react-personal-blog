import { cacheLife, cacheTag } from 'next/cache';
import { dbConnect } from '@/lib/db';
import ProjectModel from '@/models/Project';
import type { Locale } from '@/i18n/types';
import { parseProjects } from './parser';
import type { Project } from './types';

export async function getAllProjects(): Promise<Record<Locale, Project[]>> {
  'use cache';
  cacheLife('hours');
  cacheTag('projects');
  await dbConnect();
  const projects = await ProjectModel.find({}, { _id: 0, __v: 0 })
    .sort({ title: 1 })
    .lean<Project[]>();
  return parseProjects(projects);
}
