import type { ReactNode } from 'react';

interface ProjectArtworkProps {
  slug: string;
  title: string;
  order?: number;
}

export function ProjectArtwork({ slug, title, order }: ProjectArtworkProps) {
  if (slug === 'multi-terminal-capture-print-system') {
    return <MultiTerminalArtwork title={title} />;
  }

  if (slug === 'git-client') {
    return <GitClientArtwork title={title} />;
  }

  if (slug === 'ai-photo-booth-desktop') {
    return <PhotoBoothArtwork title={title} />;
  }

  if (slug === 'family-meal-planner' || order === 1) {
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

function MultiTerminalArtwork({ title }: { title: string }) {
  return (
    <ArtworkFrame label="Three-terminal flow / 01">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(255,197,0,0.2),transparent_42%)]" />
      <div className="absolute top-1/2 right-[12%] left-[12%] h-px -translate-y-1/2 bg-white/16">
        <span className="absolute top-1/2 left-[18%] h-2 w-2 -translate-y-1/2 rotate-45 bg-[#ffc500]" />
        <span className="absolute top-1/2 left-1/2 h-2 w-2 -translate-1/2 rotate-45 bg-[#ffc500]" />
        <span className="absolute top-1/2 right-[18%] h-2 w-2 -translate-y-1/2 rotate-45 bg-[#ffc500]" />
      </div>

      <div className="absolute top-[22%] left-[7%] w-[29%] border border-white/16 bg-[#090909] p-3 shadow-2xl sm:p-5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[8px] font-bold tracking-[0.16em] text-[#ffc500]">
            ENTRANCE
          </span>
          <span className="hidden font-mono text-[7px] text-white/35 sm:inline">
            iPAD / 01
          </span>
        </div>
        <div className="relative mx-auto mt-5 aspect-square w-[58%] rounded-full border-[7px] border-[#252525] bg-[#040404] sm:border-[10px]">
          <span className="absolute inset-[20%] rounded-full bg-[radial-gradient(circle_at_38%_34%,#85919c_0%,#1d2428_24%,#020202_68%)]" />
          <span className="absolute top-[26%] left-[30%] h-[11%] w-[11%] rounded-full bg-white/50" />
        </div>
        <div className="mt-5 grid grid-cols-[1fr_auto] items-end gap-3">
          <div className="space-y-1.5">
            <span className="block h-1.5 w-full bg-white/14" />
            <span className="block h-1.5 w-2/3 bg-white/8" />
          </div>
          <div className="grid h-7 w-7 grid-cols-3 gap-px bg-white p-1">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((cell) => (
              <span
                key={cell}
                className={cell === 4 || cell === 7 ? 'bg-white' : 'bg-black'}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="absolute top-[15%] left-1/2 w-[21%] -translate-x-1/2 rounded-[1.6rem] border-[5px] border-[#080808] bg-[#e9e5da] p-3 text-black shadow-2xl sm:border-[7px] sm:p-4">
        <div className="mx-auto h-1 w-7 rounded-full bg-black/20" />
        <p className="mt-4 text-center font-mono text-[7px] font-bold tracking-[0.13em] text-black/48">
          PHONE WEB
        </p>
        <div className="mx-auto mt-4 grid aspect-square w-[66%] place-items-center rounded-full bg-[#ffc500]">
          <div className="grid place-items-center">
            <span className="h-4 w-0.5 bg-black sm:h-6" />
            <span className="-mt-4 h-2.5 w-2.5 rotate-45 border-t-2 border-l-2 border-black sm:-mt-6" />
          </div>
        </div>
        <div className="mt-5 space-y-1.5">
          <span className="block h-1.5 w-full bg-black/16" />
          <span className="block h-1.5 w-3/5 bg-black/10" />
        </div>
      </div>

      <div className="absolute top-[24%] right-[6%] w-[30%] border border-white/16 bg-[#111] p-3 shadow-2xl sm:p-5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[8px] font-bold tracking-[0.15em] text-[#ffc500]">
            EXIT PRINT
          </span>
          <span className="h-2 w-2 rounded-full bg-[#72d49b]" />
        </div>
        <div className="mt-5 border border-white/12 bg-[#070707] p-3 sm:p-4">
          <div className="mx-auto h-2 w-[72%] bg-white/12" />
          <div className="relative mx-auto mt-2 h-16 w-[62%] overflow-hidden bg-[#f1ede2] shadow-xl sm:h-24">
            <span className="absolute inset-x-0 top-0 h-[42%] bg-[linear-gradient(135deg,#1a1a1a_0_58%,#ffc500_58%_75%,#e3ded2_75%)]" />
            <span className="absolute right-[12%] bottom-[18%] left-[12%] h-1.5 bg-black/18" />
            <span className="absolute right-[28%] bottom-[9%] left-[12%] h-1 bg-black/10" />
          </div>
          <div className="mx-auto mt-2 h-2 w-[78%] bg-[#ffc500]" />
        </div>
      </div>

      <div className="absolute right-[7%] bottom-[7%] left-[7%] flex items-center justify-between border-t border-white/12 pt-3 font-mono text-[8px] tracking-[0.12em] text-white/38 uppercase">
        <span>Wristband → capture → print</span>
        <span className="text-white/55">{title}</span>
      </div>
    </ArtworkFrame>
  );
}

function GitClientArtwork({ title }: { title: string }) {
  const commits = [
    ['bg-[#ffc500]', 'Release hardening'],
    ['bg-[#72d49b]', 'Merge feature/diff'],
    ['bg-[#8aa7ff]', 'Add commit graph'],
    ['bg-white/45', 'Initial commit'],
  ];

  return (
    <ArtworkFrame label="Repository graph / 00">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_72%,rgba(255,197,0,0.24),transparent_36%)]" />
      <div className="absolute top-[14%] left-[8%] w-[62%] border border-white/15 bg-[#090909] p-5 shadow-2xl sm:p-7">
        <div className="flex items-center justify-between border-b border-white/12 pb-4">
          <div>
            <p className="font-mono text-[8px] tracking-[0.18em] text-white/40 uppercase">
              Repository
            </p>
            <p className="mt-1 text-sm font-black text-white sm:text-xl">{title}</p>
          </div>
          <div className="flex gap-2 font-mono text-[8px] font-bold">
            <span className="bg-[#ffc500] px-2 py-1 text-black">main</span>
            <span className="border border-white/18 px-2 py-1 text-white/55">feature</span>
          </div>
        </div>
        <div className="mt-5 space-y-4">
          {commits.map(([color, message], index) => (
            <div key={message} className="grid grid-cols-[1rem_1fr] items-center gap-3">
              <div className="relative grid place-items-center self-stretch">
                {index < commits.length - 1 && (
                  <span className="absolute top-1/2 bottom-[-1rem] w-px bg-white/18" />
                )}
                <span className={`relative z-10 h-2.5 w-2.5 rounded-full ${color}`} />
              </div>
              <div>
                <p className="font-mono text-[9px] font-bold text-white/80 sm:text-[11px]">
                  {message}
                </p>
                <div className="mt-1.5 h-1 w-2/3 bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute right-[7%] bottom-[10%] w-[35%] rotate-2 border border-white/15 bg-[#151515] p-4 shadow-2xl sm:p-5">
        <div className="mb-4 flex items-center justify-between font-mono text-[8px]">
          <span className="text-white/45">DiffView.tsx</span>
          <span className="text-[#72d49b]">+24 −7</span>
        </div>
        <div className="space-y-2 font-mono text-[8px]">
          <p className="bg-[#72d49b]/12 px-2 py-1.5 text-[#72d49b]">+ const graph = buildGraph()</p>
          <p className="bg-[#ff7777]/10 px-2 py-1.5 text-[#ff8d8d]">− renderLegacyRows()</p>
          <p className="bg-white/[0.04] px-2 py-1.5 text-white/38"> commit.history.map(...)</p>
          <p className="bg-[#72d49b]/12 px-2 py-1.5 text-[#72d49b]">+ preserveLaneColors()</p>
        </div>
      </div>
    </ArtworkFrame>
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
