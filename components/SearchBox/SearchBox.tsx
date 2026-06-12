import { type ChangeEvent } from 'react';
import css from './SearchBox.module.css';

// Інтерфейс пропсів за схемою Ім’яКомпонентаProps
interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBox({ value, onChange }: SearchBoxProps) {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    onChange(e.target.value);
  };

  return (
    <input
      id="search-box-input" // Додано унікальний id для валідності форми
      name="search" // Додано name, щоб Chrome не видавав попередження Autofill
      className={css.input}
      type="text"
      placeholder="Search notes"
      value={value}
      onChange={handleInputChange}
    />
  );
}
