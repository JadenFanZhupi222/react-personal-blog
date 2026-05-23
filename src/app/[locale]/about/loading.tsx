import { SkeletonAbout } from '@/components/skeleton/SkeletonAbout';

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <SkeletonAbout />
    </div>
  );
}
