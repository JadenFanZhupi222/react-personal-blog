import * as Dialog from '@radix-ui/react-dialog';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import { AchievementsModalListSkeleton } from '@/components/skeleton/AchievementsModalListSkeleton';
import { ErrorFunc } from '@/components/features/Error';
import { useRef } from 'react';
import type { Translations } from '@/i18n/types';
import Image from 'next/image';

interface Achievement {
  displayName?: string;
  name?: string;
  description?: string;
  icon?: string;
  rarity?: number;
  achieved?: boolean;
}

interface Game {
  appid: number;
  name: string;
}

interface AchievementsModalProps {
  open: boolean;
  onClose: () => void;
  selectedGame?: Game;
  achievements: Achievement[];
  modalPage: number;
  modalTotalPages: number;
  setModalPage: (page: number) => void;
  loading: boolean;
  error: string | null | undefined;
  onRetry: () => void;
  t: Translations;
  MODAL_PAGE_SIZE: number;
}

export function AchievementsModal({
  open,
  onClose,
  selectedGame,
  achievements,
  modalPage,
  modalTotalPages,
  setModalPage,
  loading,
  error,
  onRetry,
  t,
  MODAL_PAGE_SIZE,
}: AchievementsModalProps) {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
        {!!selectedGame && (
          <Dialog.Content
            aria-describedby={undefined}
            className="bg-card data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-1/2 left-1/2 z-50 flex max-h-[80vh] w-[95vw] max-w-sm -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl p-4 text-left align-middle shadow-xl duration-200 sm:max-w-md sm:p-6 md:max-w-lg"
          >
            <Dialog.Title className="sr-only">{selectedGame.name}</Dialog.Title>
            <div className="relative mb-4 h-32 w-full">
              <Image
                src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${selectedGame.appid}/library_hero.jpg`}
                alt={selectedGame.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="rounded-lg object-cover"
                priority={true}
              />
            </div>
            <div className="mb-2 text-lg font-bold">{selectedGame.name}</div>
            <div className="hide-scrollbar flex-1 overflow-y-auto">
              {loading ? (
                <AchievementsModalListSkeleton />
              ) : error ? (
                <ErrorFunc onRetry={onRetry} />
              ) : achievements.length === 0 ? (
                <div className="text-muted-foreground py-8 text-center">
                  {t.achievements.noAchievements}
                </div>
              ) : (
                <>
                  <Swiper
                    modules={[Pagination]}
                    spaceBetween={16}
                    slidesPerView={1}
                    speed={300}
                    resistance={true}
                    resistanceRatio={0.85}
                    followFinger={true}
                    threshold={20}
                    touchRatio={1}
                    pagination={false}
                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                    initialSlide={modalPage - 1}
                    onSlideChange={(swiper) => setModalPage(swiper.activeIndex + 1)}
                    className="w-full"
                  >
                    {Array.from({ length: modalTotalPages }).map((_, index) => (
                      <SwiperSlide key={index}>
                        <div className="space-y-4">
                          {achievements
                            .slice(index * MODAL_PAGE_SIZE, (index + 1) * MODAL_PAGE_SIZE)
                            .map((ach, idx) => (
                              <div
                                key={idx}
                                className={`bg-muted mb-4 flex min-h-24 items-center gap-3 rounded p-3 ${ach.achieved ? 'border-achievement-green border-2' : ''}`}
                              >
                                {ach?.icon && (
                                  <div className="relative h-10 w-10">
                                    <Image
                                      src={ach.icon}
                                      alt={ach.displayName || ach.name || ''}
                                      fill
                                      sizes="40px"
                                      className={`rounded object-cover ${typeof ach.rarity === 'number' && ach.rarity < 10 ? 'border-achievement-rare-glow border-3' : ''}`}
                                      priority={false}
                                    />
                                  </div>
                                )}
                                <div className="flex-1">
                                  <div
                                    className={`line-clamp-1 font-medium ${ach.achieved ? 'text-achievement-darkgreen' : 'text-achievement-gray'}`}
                                  >
                                    {ach?.displayName || ach?.name}
                                  </div>
                                  <div className="text-muted-foreground line-clamp-2 text-xs">
                                    {ach?.description}
                                  </div>
                                  {typeof ach.rarity === 'number' && (
                                    <div
                                      className={
                                        ach.rarity < 10
                                          ? 'text-achievement-rare-glow-strong mt-1 text-xs font-bold'
                                          : 'text-achievement-gray mt-1 text-xs'
                                      }
                                    >
                                      {t.achievements.ownedByPercent.replace(
                                        '{percent}',
                                        ach.rarity.toFixed(1)
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  {modalTotalPages > 1 && (
                    <div className="mt-2 flex w-full items-center justify-center">
                      <input
                        type="range"
                        min={1}
                        max={modalTotalPages}
                        value={modalPage}
                        onChange={(e) => {
                          const page = Number(e.target.value);
                          if (swiperRef.current) {
                            swiperRef.current.slideTo(page - 1);
                          }
                        }}
                        className="accent-primary w-3/4"
                        style={{
                          accentColor: 'var(--primary-hover)',
                          backgroundColor: 'var(--primary-muted)',
                        }}
                      />
                      <span className="text-muted-foreground ml-2 text-sm">
                        {modalPage}/{modalTotalPages}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </Dialog.Content>
        )}
      </Dialog.Portal>
    </Dialog.Root>
  );
}
