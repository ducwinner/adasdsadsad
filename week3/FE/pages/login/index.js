import styles from '../../styles/Login.module.css';
import classnames from 'classnames/bind';
import Button from '../../component/Button';
import { apiLogin } from '../../api/user';
import { useCallback, useState } from 'react';
import { setStoreage } from '../../globalFunction/LocalStorage';
import { useCookies } from 'react-cookie';

const cx = classnames.bind(styles);

function Login() {
  const [cookies, setCookie] = useCookies('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [msgName, setMsgName] = useState('');
  const [msgPassword, setMsgPassword] = useState('');
  const [msgError, setMsgError] = useState('');

  const onUserNameChange = (e) => {
    setUserName(e.target.value);
  };

  const onPasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const isRequireUsername = useCallback((e) => {
    const value = e.target.value;
    if (!value) {
      setMsgName('Please enter Username!');
    } else {
      setMsgName('');
    }
  }, []);

  const isRequirePassword = useCallback((e) => {
    const value = e.target.value;
    if (!value) {
      setMsgPassword('Please enter Password!');
    } else {
      setMsgPassword('');
    }
  }, []);

  const validateAll = useCallback(async () => {
    if (msgName !== '' || msgPassword !== '') return;
    let msg = '';
    const data = await apiLogin({ userName, password });

    if (data.errCode !== 0) {
      msg = data.message;
    } else {
      setCookie('userId', data.data.id);
      window.location.href = `admin/dashboard`;
    }
    setMsgError(msg);
  }, [msgName, msgPassword, userName, password]);

  const onSubmit = () => {
    validateAll();
  };
  return (
    <div className={cx('auth')}>
      <div className={cx('container')}>
        <div className={cx('form-form')}>
          <div className={cx('form-header')}>
            <div>SOIOT SYSTEM</div>
          </div>
          <div className={cx('login-form')}>
            <div className={cx('form-item')}>
              <input
                type="text"
                placeholder="Username"
                onBlur={isRequireUsername}
                value={userName}
                onChange={onUserNameChange}
              />
              <div className={cx('message', 'message-username', 'field')}>{msgName}</div>
            </div>
            <div className={cx('form-item')}>
              <input
                type="password"
                placeholder="Password"
                onBlur={isRequirePassword}
                value={password}
                onChange={onPasswordChange}
              />
              <div className={cx('message', 'message-password', 'field')}>{msgPassword}</div>
            </div>
          </div>
          <div className={cx('message', 'form-message')}>{msgError}</div>
          <div className={cx('form-bottom')}>
            <Button text="LOGIN" onClick={onSubmit} />
            <div className={cx('other')}>or create new account</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
