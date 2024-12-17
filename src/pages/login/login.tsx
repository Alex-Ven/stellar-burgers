import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { LoginUI } from '@ui-pages';
import {
  loginUser,
  selectError,
  selectIsAuth
} from '../../services/slices/user/userSlice';
import { useDispatch, useSelector } from '../../services/store';
import { useLocation, useNavigate } from 'react-router-dom';
import { TLoginData } from '@api';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState(''); // Для отображения ошибок
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuth = useSelector(selectIsAuth); // Проверка авторизации пользователя
  const authError = useSelector(selectError); // Ошибка авторизации из хранилища

  // Получаем маршрут, с которого пользователь был перенаправлен
  const from = location.state?.from || '/'; // Если нет сохраненного маршрута, по умолчанию идем на главную страницу

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    const userLoginData: TLoginData = {
      email: email,
      password: password
    };

    if (!email || !password) {
      setErrorText('Пожалуйста, заполните все поля');
      return;
    }
    try {
      const user =
        // Ожидаем успешной авторизации пользователя
        await dispatch(loginUser(userLoginData)).unwrap();
      if (isAuth) {
        // После успешного логина выполняем редирект
        navigate(from);
      }

      setErrorText(''); // Очищаем сообщение об ошибке в случае успешного входа
    } catch (error) {
      setErrorText(authError || 'Неверный логин или пароль');
    }
  };

  return (
    <LoginUI
      errorText={errorText}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
