import Layout from '../../../layout';
import styles from '../../../styles/Admin.module.css';
import classnames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { dataActionLogs } from '../../../data/dataActionLogs';
import Pagigation from '../../../component/Pagigation';
import Button from '../../../component/Button';

const cx = classnames.bind(styles);
const rowTableLog = 10;

function Logs() {
  const [currentPage, setCurrentPage] = useState(1);
  const [dataLogs, setDataLogs] = useState(dataActionLogs);
  const [dataRenderLog, setDataRenderLog] = useState(() => dataActionLogs.filter((e, index) => index < 10));
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
    const dataSearch = dataActionLogs.filter((e) => e.name.toUpperCase().includes(valueSearch.toUpperCase()));

    setDataLogs(dataSearch);
    setCurrentPage(1);
  };

  const onPageClick = (e, type) => {
    if (type == 'next') {
      setCurrentPage((prev) => prev + 1);
    } else if (type == 'prev') {
      setCurrentPage((prev) => prev - 1);
    } else {
      setCurrentPage(+e.target.innerText);
    }
  };
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
        <Pagigation dataLength={dataLogs.length} rowOfTable={10} currentPage={currentPage} onPageClick={onPageClick} />
      </div>
    </Layout>
  );
}

export default Logs;
