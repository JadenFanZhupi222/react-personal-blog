'use client';

import dynamic from 'next/dynamic';
import { ControlPanel } from '@/components/features/ControlPanel';
import type { ContactData } from '@/lib/contact/types';
import { HeroScene } from './scenes/HeroScene';
import { TechScene } from './scenes/TechScene';
import { ProjectsScene } from './scenes/ProjectsScene';
import { ContactScene } from './scenes/ContactScene';
import { WelcomeBackdrop } from './WelcomeBackdrop';

const AmbientShader = dynamic(() => import('./AmbientShader'), { ssr: false });

export function Welcome({ contact }: { contact: ContactData | null }) {
  return (
    <>
      <div aria-hidden className="fixed inset-0 z-0 bg-background" />
      <AmbientShader />
      <WelcomeBackdrop />
      <ControlPanel />
      <main className="relative z-10 overflow-x-clip text-foreground">
        <HeroScene />
        <TechScene />
        <ProjectsScene />
        <ContactScene contact={contact} />
      </main>
    </>
  );
}
