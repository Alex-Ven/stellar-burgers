import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import {
  selectIsLoading,
  selectUser,
  updateUser
} from '../../services/slices/user/userSlice';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '../../components/ui/preloader';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const userData = useSelector(selectUser); // userData может быть null или undefined

  //Проверка на null/undefined, чтобы избежать ошибок
  if (!userData) {
    return <Preloader />; // Пока данные не загружены, показываем индикатор загрузки
  }

  // Инициализация состояния формы
  const [formValue, setFormValue] = useState({
    name: userData?.name || '',
    email: userData?.email || '',
    password: ''
  });

  useEffect(() => {
    if (userData) {
      setFormValue({
        name: userData?.name || '',
        email: userData?.email || '',
        password: ''
      });
    }
  }, [userData]); // Перезапускаем эффект, когда userData меняется

  // Проверяем, изменены ли данные формы
  const isFormChanged =
    formValue.name !== userData?.name ||
    formValue.email !== userData?.email ||
    !!formValue.password;

  // Обработчик отправки формы
  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (isFormChanged) {
      try {
        await dispatch(updateUser(formValue)).unwrap();
        // После успешного обновления можно показать уведомление или перенаправить
      } catch (error) {
        console.error('Ошибка при обновлении данных', error);
      }
    }
  };

  // Обработчик отмены изменений в форме
  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    // Сбрасываем форму к исходным данным
    setFormValue({
      name: userData?.name || '',
      email: userData?.email || '',
      password: ''
    });
  };

  // Обработчик изменений в полях формы
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
