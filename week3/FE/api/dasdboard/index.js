import axios from 'axios';

export const getDataDevice = async (payload) => {
  try {
    const response = await axios.post('http://localhost:8888/api/getAll', payload);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const addDataDevices = async (payload) => {
  try {
    const response = await axios.post('http://localhost:8888/api/add-device', payload);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};
