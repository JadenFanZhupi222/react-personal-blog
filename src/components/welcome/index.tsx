'use client';

import dynamic from 'next/dynamic';
import { ControlPanel } from '@/components/features/ControlPanel';
import { HeroScene } from './scenes/HeroScene';
import { TechScene } from './scenes/TechScene';
import { ProjectsScene } from './scenes/ProjectsScene';
import { ContactScene } from './scenes/ContactScene';

const AmbientShader = dynamic(() => import('./AmbientShader'), { ssr: false });

export function Welcome() {
  return (
    <>
      <div aria-hidden className="fixed inset-0 -z-20 bg-[#0a0a0f]" />
      <AmbientShader />
      <ControlPanel />
      <main className="relative text-white">
        <HeroScene />
        <TechScene />
        <ProjectsScene />
        <ContactScene />
      </main>
    </>
  );
}
