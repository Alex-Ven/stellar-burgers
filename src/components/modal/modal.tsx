import { FC, memo, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { TModalProps } from './type';
import { ModalUI } from '@ui';

// Получаем ссылку на DOM-элемент, в который будем монтировать модальное окно
const modalRoot = document.getElementById('modals');

export const Modal: FC<TModalProps> = memo(({ title, onClose, children }) => {
  useEffect(() => {
    // Функция обработки нажатия клавиши Escape
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Добавляем слушатель события
    document.addEventListener('keydown', handleEsc);

    // Возвращаем функцию очистки (удаление слушателя)
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  // Если modalRoot не найден, возвращаем null (модальное окно не будет рендериться)
  if (!modalRoot) return null;

  return ReactDOM.createPortal(
    <ModalUI title={title} onClose={onClose} data-cy='modal-window'>
      {children}
    </ModalUI>,
    modalRoot // Монтируем модальное окно в найденный элемент
  );
});
