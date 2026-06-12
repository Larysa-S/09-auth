'use client';

import { type ReactNode, type MouseEvent, useEffect } from 'react';
import { createPortal } from 'react-dom';
import css from './Modal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    // 1. Блокуємо прокручування сторінки, коли модалка відкрита
    document.body.style.overflow = 'hidden';

    // Обробник натискання Escape
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);

    // 2. Очищення: повертаємо початкове прокручування сторінки при закритті або розмонтуванні
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalRoot = document.getElementById('modal-root');

  return createPortal(
    <div className={css.backdrop} role="dialog" aria-modal="true" onClick={handleBackdropClick}>
      <div className={css.modal}>{children}</div>
    </div>,
    modalRoot || document.body
  );
}
