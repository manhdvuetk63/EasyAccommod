import { toast } from 'react-toastify';
import { API_URL } from './../config';
import API from './api';
import history from '../services/history';
export const register = (data: any) => {
  return API.post(API_URL + 'services/app/User/Create', data)
    .then((response) => {
      const data = response.data;
      if (data.success) {
        toast.success('✅ Đăng ký thành công, đăng nhập ngay!');
        history.push('/login');
      }
    })
    .catch((error) => {
      const err = error.response.data.error;
      toast.error(err.message + (err.details ? '\n' + err.details : ''));
    });
};

export const login = (
  username: string,
  password: string,
  remember: boolean
) => {
  return API.post(API_URL + 'TokenAuth/Authenticate', {
    userNameOrEmailAddress: username,
    password,
    rememberClient: remember,
  })
    .then((response) => {
      const data = response.data;
      if (data.success) {
        localStorage.setItem(
          'accessToken',
          JSON.stringify(response.data.result.accessToken)
        );
        const id = data.result.userId;

        API.get(API_URL + `services/app/User/Get?Id=${id}`).then((response) => {
          localStorage.setItem('user', JSON.stringify(response.data.result));
          window.location.href = '/';
          toast.success('Đăng nhập thành công 🚀');
        });
      }
      return response.data;
    })
    .catch((error) => {
      const err = error.response.data.error;
      toast.error(err.message + (err.details ? '\n' + err.details : ''));
    });
};

export const logout = () => {
  localStorage.clear();
  window.location.href = '/';
};

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const getCurrentUser = async () => {
  await API.get(
    API_URL +
      `services/app/User/Get?Id=${JSON.parse(localStorage.getItem('user')!).id}`
  ).then((response) => {
    localStorage.setItem('user', JSON.stringify(response.data.result));
  });
};

export const updateUser = (data: any) => {
  API.put(API_URL + `services/app/User/Update`, data)
    .then((response) => {
      const data = response.data;
      if (data.success) {
        getCurrentUser().then(() => {
          toast.success('Cập nhật user thành công!');
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        });
      }
      return response.data;
    })
    .catch((error) => {
      const err = error.response.data.error;
      toast.error(err.message + (err.details ? '\n' + err.details : ''));
    });
};
