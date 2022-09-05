import Layout from '../../../layout';
import styles from '../../../styles/Admin.module.css';
import classnames from 'classnames/bind';
import { useState } from 'react';
import ChartPower from '../../../component/ChartPie';
import Button from '../../../component/Button';
import { addDataDevices, getDataDevice } from '../../../api/dasdboard';

const cx = classnames.bind(styles);
const rowTableLog = 10;

function Dashboard({ dataDevices, userId }) {
  const [dataDeviceRedner, setDataDeviceRedner] = useState(dataDevices);
  const [name, setName] = useState('');
  const [ip, setIp] = useState('');
  const [power, setPower] = useState('');
  const [validateMsg, setValidateMsg] = useState({ isPower: false, msg: '' });

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
    </Layout>
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

export default Dashboard;
