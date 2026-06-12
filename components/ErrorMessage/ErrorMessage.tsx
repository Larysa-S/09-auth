import css from './ErrorMessage.module.css';

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorMessage({
  message = 'Something went wrong. Please try again later.',
  onRetry,
}: ErrorMessageProps) {
  return (
    <div className={css.errorContainer} role="alert">
      <span className={css.icon}>⚠️</span>
      <p className={css.text}>{message}</p>
      {onRetry && (
        <button className={css.retryButton} type="button" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
}
