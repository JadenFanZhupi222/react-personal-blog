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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ContactPage({ contact }: { contact: ContactData }) {
  const { t } = useTranslations();

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        className="bg-background flex min-h-[90dvh] items-start justify-center px-2 py-0 lg:items-center lg:py-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="mx-auto grid h-[260px] w-full max-w-4xl gap-8 pt-8 sm:grid-cols-3 sm:pt-0">
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
                  className="text-foreground font-mono text-lg hover:underline"
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
                      <span className="text-foreground font-mono text-lg">{item.value}</span>
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
                      className="flex items-center gap-2 hover:underline"
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
