import Loader from '@/components/Loader/Loader';

export default function GlobalLoading() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
      }}
    >
      <p>Loading, please wait...</p>

      <Loader message="Preparing NoteHub for you..." />
    </div>
  );
}
