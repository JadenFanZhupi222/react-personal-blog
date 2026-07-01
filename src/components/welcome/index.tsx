'use client';

import dynamic from 'next/dynamic';
import { ControlPanel } from '@/components/features/ControlPanel';
import { HeroScene } from './scenes/HeroScene';
import { TechScene } from './scenes/TechScene';
import { ProjectsScene } from './scenes/ProjectsScene';
import { ContactScene } from './scenes/ContactScene';
import { WelcomeBackdrop } from './WelcomeBackdrop';

const AmbientShader = dynamic(() => import('./AmbientShader'), { ssr: false });

export function Welcome() {
  return (
    <>
      <div aria-hidden className="fixed inset-0 z-0 bg-background" />
      <AmbientShader />
      <WelcomeBackdrop />
      <ControlPanel />
      <main className="relative z-10 text-foreground">
        <HeroScene />
        <TechScene />
        <ProjectsScene />
        <ContactScene />
      </main>
    </>
  );
}
