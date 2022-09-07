import classnames from 'classnames/bind';
import styles from '../styles/Home.module.css';
import ReactLoading from 'react-loading';
import cookie from 'cookie';

const cx = classnames.bind(styles);
function Home() {
  return (
    <div className={cx('container')}>
      <ReactLoading type={'spin'} color={'rgb(218, 177, 16)'} height={150} width={150} />
    </div>
  );
}

export const getServerSideProps = async ({ req }) => {
  let cookieHeader = req.headers.cookie;
  if (typeof cookieHeader !== 'string') {
    cookieHeader = '';
  }

  const dataCookie = cookie.parse(cookieHeader);
  const userId = dataCookie.userId;
  if (userId) {
    return {
      redirect: {
        destination: '/admin/dashboard',
        permanent: false,
      },
    };
  } else {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
};

export default Home;
