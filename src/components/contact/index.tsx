'use client';

import { Mail, AtSign } from 'lucide-react';
import {
  SiTiktok,
  SiXiaohongshu,
  SiBilibili,
  SiGithub,
  SiGmail,
  SiMaildotru,
} from 'react-icons/si';
import { FaQq } from 'react-icons/fa';
import { useTranslations } from '@/lib/hooks/useTranslations';
import React from 'react';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { ContactCard } from './contactCard';
import type { ContactData } from '@/lib/contact/types';
import { containerVariants, itemVariants } from '@/lib/animations';

const emailIconMap: Record<string, React.ReactNode> = {
  gmail: <SiGmail className="text-foreground text-xl" />,
  netease: <SiMaildotru className="text-foreground text-xl" />,
  qq: <FaQq className="text-foreground text-xl" />,
};
const socialIconMap: Record<string, React.ReactNode> = {
  tiktok: <SiTiktok className="text-foreground text-xl" />,
  xiaohongshu: <SiXiaohongshu className="text-foreground text-xl" />,
  bilibili: <SiBilibili className="text-foreground text-xl" />,
};

export default function ContactPage({ contact }: { contact: ContactData }) {
  const { t } = useTranslations();

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        className="observatory-shell flex min-h-[90dvh] items-start justify-center px-3 py-12 lg:items-center lg:py-16"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="mx-auto grid w-full max-w-5xl gap-5 sm:grid-cols-3">
          {[
            {
              key: 'github',
              icon: <SiGithub className="text-foreground h-7 w-7" />,
              title: t.contact.github,
              content: (
                <a
                  href={contact.github.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md font-mono text-lg text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {contact.github.username}
                </a>
              ),
            },
            {
              key: 'email',
              icon: <Mail className="text-foreground h-7 w-7" />,
              title: t.contact.emails,
              content: (
                <div className="mt-2 flex flex-col gap-1">
                  {contact.emails.map((item) => (
                    <div key={item.value} className="flex items-center gap-2">
                      {emailIconMap[item.iconKey]}
                      <span className="break-all font-mono text-base text-foreground">{item.value}</span>
                    </div>
                  ))}
                </div>
              ),
            },
            {
              key: 'social',
              icon: <AtSign className="text-foreground h-7 w-7" />,
              title: t.contact.socials,
              content: (
                <div className="flex flex-col gap-2">
                  {contact.socials.map((item) => (
                    <a
                      key={item.label}
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-md hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {socialIconMap[item.iconKey]}
                      <span className="font-mono text-sm">{item.value}</span>
                    </a>
                  ))}
                </div>
              ),
            },
          ].map((card) => (
            <m.div key={card.key} variants={itemVariants}>
              <ContactCard icon={card.icon} title={card.title}>
                {card.content}
              </ContactCard>
            </m.div>
          ))}
        </div>
      </m.div>
    </LazyMotion>
  );
}
