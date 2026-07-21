import type { ReactNode } from 'react';

interface ProjectArtworkProps {
  slug: string;
  title: string;
}

export function ProjectArtwork({ slug, title }: ProjectArtworkProps) {
  if (slug === 'ai-photo-booth-desktop' || slug === 'zoda-ai-photo-booth') {
    return <PhotoBoothArtwork title={title} />;
  }

  if (slug === 'family-meal-planner') {
    return <MealPlannerArtwork title={title} />;
  }

  return <DatePickerArtwork title={title} />;
}

function ArtworkFrame({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="relative min-h-[21rem] overflow-hidden bg-[#171717] sm:min-h-[27rem] lg:min-h-[32rem]">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:42px_42px]" />
      <span className="absolute top-5 left-5 z-20 font-mono text-[10px] font-bold tracking-[0.18em] text-white/55 uppercase">
        {label}
      </span>
      {children}
    </div>
  );
}

function PhotoBoothArtwork({ title }: { title: string }) {
  return (
    <ArtworkFrame label="Capture system / 01">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_34%,rgba(255,197,0,0.26),transparent_34%)]" />
      <div className="absolute top-[18%] left-[9%] w-[46%] rounded-[1.8rem] border border-white/15 bg-[#0a0a0a] p-4 shadow-2xl sm:p-6">
        <div className="mb-6 flex items-center justify-between">
          <span className="h-2 w-2 rounded-full bg-[#ffc500]" />
          <span className="font-mono text-[9px] tracking-[0.18em] text-white/45">SESSION 01</span>
        </div>
        <div className="relative mx-auto aspect-square w-[66%] rounded-full border-[10px] border-[#222] bg-[#050505] shadow-[inset_0_0_0_1px_rgba(255,255,255,.12)] sm:border-[16px]">
          <div className="absolute inset-[18%] rounded-full bg-[radial-gradient(circle_at_38%_35%,#6f7984_0%,#151a1e_23%,#030303_64%)]" />
          <div className="absolute top-[25%] left-[30%] h-[12%] w-[12%] rounded-full bg-white/55 blur-[1px]" />
        </div>
        <div className="mt-7 flex gap-2">
          <span className="h-1.5 flex-1 bg-[#ffc500]" />
          <span className="h-1.5 w-8 bg-white/14" />
          <span className="h-1.5 w-8 bg-white/14" />
        </div>
      </div>
      <div className="absolute right-[10%] bottom-[10%] w-[31%] rotate-3 bg-[#f1ede2] p-2 shadow-2xl sm:p-3">
        <div className="grid gap-2 sm:gap-3">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="aspect-[4/2.3] bg-[linear-gradient(135deg,#151515_0_55%,#ffc500_55%_72%,#dfdbd0_72%)]"
            />
          ))}
        </div>
        <p className="mt-2 truncate font-mono text-[8px] font-bold tracking-[0.12em] text-black/65 uppercase sm:text-[10px]">
          {title}
        </p>
      </div>
    </ArtworkFrame>
  );
}

function MealPlannerArtwork({ title }: { title: string }) {
  const days = ['MON', 'TUE', 'WED'];
  return (
    <ArtworkFrame label="Meal planner / 02">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_72%,rgba(255,197,0,0.26),transparent_34%)]" />
      <div className="absolute top-[13%] right-[12%] w-[52%] rounded-[2.1rem] border-[6px] border-[#080808] bg-[#f3efe5] p-5 text-black shadow-2xl sm:border-[9px] sm:p-7">
        <div className="flex items-center justify-between border-b border-black/15 pb-4">
          <div>
            <p className="font-mono text-[8px] font-bold tracking-[0.15em] text-black/45 uppercase">This week</p>
            <p className="mt-1 text-sm font-black sm:text-xl">Family table</p>
          </div>
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#ffc500] text-lg font-black">+</span>
        </div>
        <div className="mt-4 space-y-3">
          {days.map((day, index) => (
            <div key={day} className="grid grid-cols-[2rem_1fr_2.6rem] items-center gap-3">
              <span className="font-mono text-[8px] font-bold text-black/45">{day}</span>
              <div>
                <div className="h-2 rounded-full bg-black/80" style={{ width: `${82 - index * 12}%` }} />
                <div className="mt-2 h-1.5 w-1/2 rounded-full bg-black/15" />
              </div>
              <div className={`aspect-square rounded-lg ${index === 1 ? 'bg-[#ffc500]' : 'bg-[#d9d2c4]'}`} />
            </div>
          ))}
        </div>
        <p className="mt-5 truncate border-t border-black/15 pt-4 font-mono text-[8px] font-bold tracking-[0.12em] text-black/55 uppercase sm:text-[10px]">
          {title}
        </p>
      </div>
      <div className="absolute bottom-[14%] left-[10%] w-[31%] -rotate-6 border border-white/15 bg-[#111] p-4 text-white shadow-xl sm:p-5">
        <span className="font-mono text-[8px] tracking-[0.15em] text-[#ffc500]">SHOPPING LIST</span>
        <div className="mt-4 space-y-3">
          {[72, 88, 56, 76].map((width) => (
            <div key={width} className="flex items-center gap-2">
              <span className="h-3 w-3 border border-white/30" />
              <span className="h-1.5 bg-white/24" style={{ width: `${width}%` }} />
            </div>
          ))}
        </div>
      </div>
    </ArtworkFrame>
  );
}

function DatePickerArtwork({ title }: { title: string }) {
  const dates = Array.from({ length: 35 }, (_, index) => index + 1);
  return (
    <ArtworkFrame label="Date system / 03">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(255,197,0,0.24),transparent_36%)]" />
      <div className="absolute top-[16%] left-[10%] w-[72%] border border-white/15 bg-[#0b0b0b] p-5 shadow-2xl sm:p-8">
        <div className="mb-5 flex items-center justify-between border-b border-white/12 pb-4 sm:mb-7">
          <div>
            <p className="font-mono text-[8px] tracking-[0.18em] text-white/40">SELECT RANGE</p>
            <p className="mt-1 text-sm font-black text-white sm:text-xl">July 2026</p>
          </div>
          <div className="flex gap-2"><span className="h-8 w-8 border border-white/16" /><span className="h-8 w-8 bg-[#ffc500]" /></div>
        </div>
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {dates.map((date) => {
            const selected = date >= 15 && date <= 20;
            return (
              <span
                key={date}
                className={`grid aspect-square place-items-center font-mono text-[8px] sm:text-xs ${selected ? 'bg-[#ffc500] font-black text-black' : 'bg-white/[0.045] text-white/55'}`}
              >
                {date > 31 ? date - 31 : date}
              </span>
            );
          })}
        </div>
        <p className="mt-5 truncate font-mono text-[8px] font-bold tracking-[0.12em] text-white/38 uppercase sm:text-[10px]">{title}</p>
      </div>
    </ArtworkFrame>
  );
}
