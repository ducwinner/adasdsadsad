import axios from 'axios';

export const getActionLogs = async (payload) => {
  try {
    const response = await axios.post('http://localhost:8888/api/get-logs', payload);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};
