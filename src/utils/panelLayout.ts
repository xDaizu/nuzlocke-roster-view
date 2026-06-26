/**
 * Map a column span (1-6) to its Tailwind `lg:col-span-*` class.
 * Listed explicitly so Tailwind's content scanner includes every class.
 */
export const getColSpanClass = (span: number): string => {
  const spanClasses: Record<number, string> = {
    1: 'lg:col-span-1',
    2: 'lg:col-span-2',
    3: 'lg:col-span-3',
    4: 'lg:col-span-4',
    5: 'lg:col-span-5',
    6: 'lg:col-span-6',
  };
  return spanClasses[span] || 'lg:col-span-1';
};
