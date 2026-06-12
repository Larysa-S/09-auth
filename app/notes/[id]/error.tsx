'use client';

import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';

export default function NoteDetailsError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{ padding: '20px' }}>
      <ErrorMessage message={`Could not fetch note details. ${error.message}`} onRetry={reset} />
    </div>
  );
}
