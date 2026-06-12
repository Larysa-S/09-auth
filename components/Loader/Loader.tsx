import css from './Loader.module.css';

interface LoaderProps {
  message?: string;
}

export default function Loader({ message = 'Loading data, please wait...' }: LoaderProps) {
  return (
    <div className={css.loaderContainer} role="status" aria-live="polite">
      <div className={css.spinner}></div>
      <p className={css.text}>{message}</p>
    </div>
  );
}
