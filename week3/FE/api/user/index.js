import axios from 'axios';

export const apiLogin = async (payload) => {
  try {
    const response = await axios.post('http://localhost:8888/api/login', payload);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};
