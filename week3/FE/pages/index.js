import classnames from 'classnames/bind';
import styles from '../styles/Home.module.css';
import Link from 'next/link';

const cx = classnames.bind(styles);
function Home() {
  return (
    <div className={cx('container')}>
      <Link
        href={{
          pathname: '/login',
        }}
      >
        <a className={cx('item')}>Login</a>
      </Link>
      <Link
        href={{
          pathname: '/admin/dashboard/1',
        }}
      >
        <a className={cx('item')}>Admin</a>
      </Link>
    </div>
  );
}

export default Home;
