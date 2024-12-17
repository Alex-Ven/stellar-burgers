import { FC, SyntheticEvent, useState, useEffect } from 'react';
import { RegisterUI } from '@ui-pages';
import { Preloader } from '../../components/ui/preloader';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import {
  registerUser,
  selectError,
  selectIsLoading
} from '../../services/slices/user/userSlice';
import { TRegisterData } from '@api';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);

  useEffect(() => {
    if (error) {
      setErrorMessage(error);
    }
  }, [error]);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    // Валидация вводимых данных
    if (!userName || !email || !password) {
      setErrorMessage('Все поля обязательны для заполнения.');
      return;
    }

    const newUserData: TRegisterData = {
      name: userName,
      email: email,
      password: password
    };

    try {
      await dispatch(registerUser(newUserData));
      // После успешной регистрации переходим на страницу входа
      navigate('/login');
    } catch (err) {
      // Логирование ошибки, если она произошла
      setErrorMessage('Ошибка регистрации. Пожалуйста, попробуйте еще раз.');
    }

    // Сброс значений формы после успешной отправки
    setUserName('');
    setEmail('');
    setPassword('');
  };

  if (isLoading) {
    return <Preloader />; // Отображение прелоадера во время регистрации
  }

  return (
    <RegisterUI
      errorText={errorMessage} // Передаем сообщение об ошибке для отображения
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
