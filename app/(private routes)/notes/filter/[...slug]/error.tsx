'use client';

import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';

export default function NotesError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{ padding: '20px' }}>
      <ErrorMessage
        message={`Could not fetch the list of notes. ${error.message}`}
        onRetry={reset}
      />
    </div>
  );
}
