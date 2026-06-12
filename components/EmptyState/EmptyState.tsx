import css from './EmptyState.module.css';

interface EmptyStateProps {
  isSearchActive: boolean;
  onClearSearch?: () => void;
}

export default function EmptyState({ isSearchActive, onClearSearch }: EmptyStateProps) {
  return (
    <div className={css.container}>
      <span className={css.icon}>📝</span>
      <h3 className={css.title}>
        {isSearchActive ? 'No matching notes found' : 'Your NoteHub is empty'}
      </h3>
      <p className={css.text}>
        {isSearchActive
          ? 'Try refining your search terms or clear the filter.'
          : 'Create your very first note to get started!'}
      </p>
      {isSearchActive && onClearSearch && (
        <button className={css.clearButton} type="button" onClick={onClearSearch}>
          Clear Search
        </button>
      )}
    </div>
  );
}
