import styles from '../styles/Admin.module.css';
import classnames from 'classnames/bind';
import {
  faHouseLaptop,
  faBars,
  faCircleUser,
  faChartPie,
  faHourglassHalf,
  faGear,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { setStorage, getStorage } from '../globalFunction/LocalStorage';

const cx = classnames.bind(styles);

function Layout({ children }) {
  const [hide, setHide] = useState(true);
  const [navId, setNavId] = useState('1');

  useEffect(() => {
    const id = getStorage('navId');
    if (!id) {
      setStorage('navId', 1);
    } else {
      setNavId(id);
    }
  }, []);

  const onSetNavItem = (id) => {
    setStorage('navId', id);
  };

  const onHideMenu = () => {
    setHide(true);
  };

  const onShowMenu = () => {
    setHide(false);
  };
  return (
    <>
      <div className={cx('app')}>
        <div className={cx('page-admin')}>
          <div className={cx('sidebar', hide ? 'hideMobide' : '')}>
            <div className={cx('sidebar-header', 'hideMobide')}>
              <FontAwesomeIcon icon={faHouseLaptop} className={cx('device-icon')} />
              <span>Device Manager</span>
            </div>
            <div className={cx('user-mobie')}>
              <FontAwesomeIcon icon={faCircleUser} className={cx('user-icon')} />
              <div className={cx('header-user-name')}>Duc Nguyen</div>
            </div>
            <ul className={cx('sidebar-list')}>
              <li className={cx('sidebar-item')}>
                <FontAwesomeIcon icon={faChartPie} className={cx('nav-icon')} />
                <Link href="/admin/dashboard">
                  <a
                    onClick={() => onSetNavItem('1')}
                    className={cx('sidebar-item-text', navId === '1' || undefined ? 'active' : null)}
                  >
                    Dashboard
                  </a>
                </Link>
              </li>
              <li className={cx('sidebar-item')}>
                <FontAwesomeIcon icon={faHourglassHalf} className={cx('nav-icon')} />
                <Link href="/admin/logs">
                  <a
                    onClick={() => onSetNavItem('2')}
                    className={cx('sidebar-item-text', navId === '2' ? 'active' : null)}
                  >
                    Logs
                  </a>
                </Link>
              </li>
              <li className={cx('sidebar-item')}>
                <FontAwesomeIcon icon={faGear} className={cx('nav-icon')} />
                <Link href="/admin/setting">
                  <a
                    onClick={() => onSetNavItem('3')}
                    className={cx('sidebar-item-text', navId === '3' ? 'active' : null)}
                  >
                    Setting
                  </a>
                </Link>
              </li>
            </ul>
          </div>
          <div className={cx('main')}>
            <div className={cx('main-header', 'hideMobide')}>
              <div className={cx('header-user')}>
                <FontAwesomeIcon icon={faCircleUser} className={cx('user-icon')} />
                <div className={cx('header-user-name')}>Duc Nguyen</div>
              </div>
            </div>
            <div className={cx('menu-mobie')}>
              <FontAwesomeIcon onClick={onShowMenu} icon={faBars} fontSize={20} />
            </div>
            <div className={cx('main-body')} onClick={onHideMenu}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Layout;
