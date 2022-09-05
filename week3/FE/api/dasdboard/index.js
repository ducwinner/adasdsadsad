import axios from 'axios';

export const getDataDevice = async (payload) => {
  try {
    const response = await axios.post('http://localhost:8000/api/getAll', payload);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const addDataDevices = async (payload) => {
  try {
    const response = await axios.post('http://localhost:8000/api/add-device', payload);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};
