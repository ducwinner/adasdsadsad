import Layout from '../../../layout';
import styles from '../../../styles/Admin.module.css';
import classnames from 'classnames/bind';
import { useCallback, useState } from 'react';
import ChartPower from '../../../component/ChartPie';
import Button from '../../../component/Button';
import { addDataDevices, getDataDevice } from '../../../api/dasdboard';
import cookie from 'cookie';

const cx = classnames.bind(styles);
const rowTableLog = 10;

function Dashboard({ dataDevices, userId }) {
  const [dataDeviceRedner, setDataDeviceRedner] = useState(dataDevices);
  const [name, setName] = useState('');
  const [ip, setIp] = useState('');
  const [power, setPower] = useState('');
  const [validateMsg, setValidateMsg] = useState();

  const onNameChange = (e) => {
    setName(e.target.value);
  };

  const onIpChange = (e) => {
    setIp(e.target.value);
  };

  const onPowerChange = (e) => {
    setPower(e.target.value);
  };

  const validateAll = useCallback(() => {
    const msg = '';
    if (name !== '' && ip !== '') {
      const vnf_regex =
        /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      if (vnf_regex.test(ip)) {
        if (power) {
          const regex = /^[1-9][0-9]*$/;
          if (!regex.test(power)) {
            msg = 'Power value is an integer ( > 0 )';
            setValidateMsg(msg);
          } else {
            return true;
          }
        } else {
          msg = 'Vui lòng nhập Power';
        }
      } else {
        msg = 'Địa chỉ IP không hợp lệ';
      }
    } else {
      msg = 'Vui lòng nhập đủ các trường';
    }

    setValidateMsg(msg);
    return false;
  }, [power, validateMsg, ip]);

  const onAddDevice = useCallback(() => {
    validateAll();
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

      // Api add
      const response = addDataDevices(dataAdd);

      // reset value input
      setName('');
      setPower('');
      setIp('');
      setValidateMsg('');
    } else {
      validateAll();
    }
  }, [power, name, ip]);
  return (
    <Layout>
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
            <div className={cx('form-item', 'form-item-power')}>
              <input type="number" value={power} onChange={onPowerChange} placeholder="nhập thêm power" />
            </div>
            <div className={cx('form-message-device')}>{validateMsg}</div>;
            <Button text="ADD Device" onClick={onAddDevice} />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps = async ({ req }) => {
  const dataCookie = cookie.parse(req.headers.cookie);
  const userId = dataCookie.userId;
  if (userId) {
    const response = await getDataDevice({ userId });
    let dataDevices = response.data;
    return {
      props: {
        dataDevices,
        userId,
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

export default Dashboard;
