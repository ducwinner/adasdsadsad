import Layout from '../../../layout';
import styles from '../../../styles/Admin.module.css';
import classnames from 'classnames/bind';
import { useCallback, useEffect, useState } from 'react';
import Pagination from '../../../component/Pagination';
import Button from '../../../component/Button';
import { getActionLogs } from '../../../api/logs';
import cookie from 'cookie';

const cx = classnames.bind(styles);
const rowTableLog = 10;

function Logs({ data }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [dataLogs, setDataLogs] = useState(data);
  const [dataRenderLog, setDataRenderLog] = useState(() => data.filter((e, index) => index < 10));
  const [valueSearch, setValueSearch] = useState('');

  const onSearchChange = (e) => {
    setValueSearch(e.target.value);
  };

  // filler 10 Logs
  useEffect(() => {
    const lastIndexLogsRender = +currentPage * rowTableLog;
    const data = dataLogs.filter(
      (e, index) => lastIndexLogsRender - rowTableLog <= index && index <= lastIndexLogsRender
    );
    setDataRenderLog(data);
  }, [currentPage, dataLogs]);

  const onSearchClick = () => {
    const dataSearch = data.filter((e) => e.name.toUpperCase().includes(valueSearch.toUpperCase()));

    setDataLogs(dataSearch);
    setCurrentPage(1);
  };

  const onPageClick = useCallback((e, type) => {
    if (type == 'next') {
      setCurrentPage((prev) => prev + 1);
    } else if (type == 'prev') {
      setCurrentPage((prev) => prev - 1);
    } else {
      setCurrentPage(+e.target.innerText);
    }
  });

  return (
    <Layout>
      <div className={cx('logs')}>
        <div className={cx('logs-header')}>
          <div className={cx('logs-header-title')}>Action Logs</div>
          <div className={cx('logs-header-search')}>
            <input type="text" placeholder="name" value={valueSearch} id="search" onChange={(e) => onSearchChange(e)} />
            <Button text="Search" onClick={onSearchClick} typeSearch={true} />
            <ul className={cx('history', 'hide')}>
              <li>abc</li>
            </ul>
          </div>
        </div>
        <div className={cx('logs-body')}>
          <div className={cx('dashboard-device')}>
            <table className={cx('table-device')}>
              <thead>
                <tr>
                  <th>Device ID*</th>
                  <th>Name</th>
                  <th>Action</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {dataRenderLog.map((e, index) => (
                  <tr key={index}>
                    <td>{e.id}</td>
                    <td>{e.name}</td>
                    <td>{e.action}</td>
                    <td>{e.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <Pagination dataLength={dataLogs.length} rowOfTable={10} currentPage={currentPage} onPageClick={onPageClick} />
      </div>
    </Layout>
  );
}

export const getServerSideProps = async ({ req }) => {
  const dataCookie = cookie.parse(req.headers.cookie);
  const userId = dataCookie.userId;
  if (userId) {
    const response = await getActionLogs({ userId });
    let data = response.data;
    return {
      props: {
        data,
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
export default Logs;
