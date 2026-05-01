import { AboutContent } from '@/components/about';
import { getAboutData } from '@/lib/about/server';

export default async function AboutPage() {
  const data = await getAboutData();
  return <AboutContent data={data} />;
}
