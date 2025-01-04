import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { selectIsAuth, userLogout } from '../../services/slices/user/userSlice';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Выполняем логаут
      await dispatch(userLogout()).unwrap();

      // Навигация после успешного выхода
      navigate('/');
    } catch (error) {}
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
