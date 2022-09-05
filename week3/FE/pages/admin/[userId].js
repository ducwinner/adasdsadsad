import styles from '../../styles/Admin.module.css';
import classnames from 'classnames/bind';
import { faHouseLaptop, faCircleUser, faChartPie, faHourglassHalf, faGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import ChartPower from '../../component/ChartPie';
import { dataDevice } from '../../data/dataDevice';
import { dataActionLogs } from '../../data/dataActionLogs';
import Pagigation from '../../component/Pagigation';
import Button from '../../component/Button';
import { addDataDevices, getDataDevice } from '../../api/dasdboard';
import { getStoreage } from '../../globalFunction/LocalStoreage';

const cx = classnames.bind(styles);
const rowTableLog = 10;

function Admin({ dataDevices, userId }) {
  const [navItem, setNavItem] = useState('1');
  const [currentPage, setCurrentPage] = useState(1);
  const [dataLogs, setDataLogs] = useState(dataActionLogs);
  const [dataRenderLog, setDataRenderLog] = useState(() => dataActionLogs.filter((e, index) => index < 10));
  const [dataDeviceRedner, setDataDeviceRedner] = useState(dataDevices);
  const [valueSearch, setValueSearch] = useState('');
  const [name, setName] = useState('');
  const [ip, setIp] = useState('');
  const [power, setPower] = useState('');
  const [validateMsg, setValidateMsg] = useState({ isPower: false, msg: '' });

  const onSetNavItem = (id) => {
    setNavItem(id);
  };

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

  const onNameChange = (e) => {
    setName(e.target.value);
  };

  const onIpChange = (e) => {
    setIp(e.target.value);
  };

  const onPowerChange = (e) => {
    setPower(e.target.value);
  };

  const validateAll = () => {
    const msg = '';
    if (name !== '' && ip !== '') {
      var vnf_regex =
        /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      if (vnf_regex.test(ip)) {
        msg = { isPower: true, msg: 'Vui lòng nhập Power' };
        setValidateMsg(msg);
        return true;
      } else {
        msg = { isPower: false, msg: 'Địa chỉ IP không hợp lệ' };
      }
    } else {
      msg = { isPower: false, msg: 'Vui lòng nhập đủ các trường' };
    }

    setValidateMsg(msg);
    return false;
  };

  const onAddDevice = () => {
    const isValid = validateAll();
    if (!isValid) return;
    if (power) {
      // push Data
      const today = new Date();
      const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
      const dataAdd = {
        name: name,
        address: '',
        ip: ip,
        createDate: date,
        power: parseInt(power),
        userId: userId,
      };

      setDataDeviceRedner((prev) => [...prev, dataAdd]);

      // add Api
      const response = addDataDevices(dataAdd);
      console.log(response);

      // reset value input
      setName('');
      setPower('');
      setIp('');
      setValidateMsg({ isPower: false, msg: '' });
    } else {
      validateAll();
    }
  };

  return (
    <>
      <div className={cx('app')}>
        <div className={cx('page-admin')}>
          <div className={cx('sidebar', 'hideMobide')}>
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
                <span
                  className={cx('sidebar-item-text', navItem === '1' ? 'active' : null)}
                  onClick={() => onSetNavItem('1')}
                >
                  Dashboard
                </span>
              </li>
              <li className={cx('sidebar-item')}>
                <FontAwesomeIcon icon={faHourglassHalf} className={cx('nav-icon')} />
                <span
                  className={cx('sidebar-item-text', navItem === '2' ? 'active' : null)}
                  onClick={() => onSetNavItem('2')}
                >
                  Logs
                </span>
              </li>
              <li className={cx('sidebar-item')}>
                <FontAwesomeIcon icon={faGear} className={cx('nav-icon')} />
                <span
                  className={cx('sidebar-item-text', navItem === '3' ? 'active' : null)}
                  onClick={() => onSetNavItem('3')}
                >
                  Setting
                </span>
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
              <i className={cx('bx bx-menu')}></i>
            </div>
            <div className={cx('main-body')}>
              {navItem === '1' ? (
                <div className={cx('dashboard')}>
                  <div className={cx('dashboard-device')}>
                    <table className={cx('table-device', 'hideMobide')}>
                      <thead>
                        <tr>
                          <th>Device</th>
                          <th>MAC Adress</th>
                          <th>IP</th>
                          <th>Create Date</th>
                          <th>Power Consumption ( KW/H )</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dataDeviceRedner.map((e, index) => (
                          <tr key={index}>
                            <td>{e.name}</td>
                            <td>{e.address}</td>
                            <td>{e.ip}</td>
                            <td>{e.createDate}</td>
                            <td>{e.power}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className={cx('main-bottom')}>
                    <div className={cx('main-chart')}>
                      <ChartPower data={dataDeviceRedner} />
                    </div>
                    <div className={cx('main-form')}>
                      <div className={cx('form-item')}>
                        <input type="text" placeholder="name" value={name} onChange={onNameChange} />
                      </div>
                      <div className={cx('form-item')}>
                        <input type="text" value={ip} placeholder="id" onChange={onIpChange} />
                      </div>
                      {validateMsg.isPower ? (
                        <div className={cx('form-item', 'form-item-power')}>
                          <input type="number" value={power} onChange={onPowerChange} placeholder="nhập thêm power" />
                        </div>
                      ) : null}
                      <div className={cx('form-message-device')}>{validateMsg.msg}</div>
                      <Button text="ADD Device" onClick={onAddDevice} />
                    </div>
                  </div>
                </div>
              ) : navItem === '2' ? (
                <div className={cx('logs')}>
                  <div className={cx('logs-header')}>
                    <div className={cx('logs-header-title')}>Action Logs</div>
                    <div className={cx('logs-header-search')}>
                      <input
                        type="text"
                        placeholder="name"
                        value={valueSearch}
                        id="search"
                        onChange={(e) => onSearchChange(e)}
                      />
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
                  <Pagigation
                    dataLength={dataLogs.length}
                    rowOfTable={10}
                    currentPage={currentPage}
                    onPageClick={onPageClick}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = async ({ params }) => {
  console.log(rowTableLog);
  const userId = params.userId;
  const response = await getDataDevice(params);
  let dataDevices = response.data;
  return {
    props: {
      dataDevices,
      userId,
    },
  };
};

export default Admin;
