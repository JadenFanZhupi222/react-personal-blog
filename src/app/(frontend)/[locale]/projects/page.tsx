import { ProjectListPage } from '@/components/project';
import { getAllProjects } from '@/lib/project/server';

export default async function ProjectsPage() {
  const projects = await getAllProjects();
  return <ProjectListPage projects={projects} />;
}
