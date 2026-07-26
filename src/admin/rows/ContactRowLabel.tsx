'use client';

import { useRowLabel } from '@payloadcms/ui';

type ContactRow = {
  label?: string;
  value?: string;
};

export function ContactRowLabel() {
  const { data, rowNumber } = useRowLabel<ContactRow>();

  return <span>{data.label || data.value || `Item ${(rowNumber ?? 0) + 1}`}</span>;
}
