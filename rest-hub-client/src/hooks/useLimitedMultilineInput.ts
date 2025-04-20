import { useState, useEffect } from 'react';

import { TextValueUpdater } from '@/types';

interface UseLimitedTextareaProps {
  maxChars: number;
  maxLines: number;
  initialValue?: string;
}

export function useLimitedTextarea({
  maxChars,
  maxLines,
  initialValue = '',
}: UseLimitedTextareaProps) {
  const [value, setValueInternal] = useState(initialValue);

  useEffect(() => {
    setValueInternal(initialValue);
  }, [initialValue]);

  const charCount = value.length;

  const isOverCharLimit = charCount >= maxChars;

  const setValue = (next: TextValueUpdater) => {
    const nextValue = typeof next === 'function' ? next(value) : next;

    const nextLines = nextValue.split('\n');
    const nextLineCount = nextLines.length;
    const nextCharCount = Array.from(nextValue).length;

    if (nextCharCount > maxChars || nextLineCount > maxLines) {
      return;
    }

    setValueInternal(next);
  };

  return {
    value,
    setValue,
    isOverCharLimit,
  };
}
