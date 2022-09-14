// call api
import axios from 'axios';
const axiosProducts = axios.create({
  baseURL: 'https://training-duc-nv.myshopify.com/admin/api/2022-07/graphql.json',
  headers: {
    'Content-type': 'aplication/json',
    'X-Shopify-Access-Token': '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',
  },
});

axiosProducts.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosProducts.interceptors.response.use(
  function (response) {
    setTimeout(function () {}, 1000);
    return response.data;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

const callapi = async () => {
  const a = await axiosProducts.post('/', {
    query: `
      {
        shop {
          name
        }
      }
      `,
    variables: {},
  });
  console.log('callapi', a);
};

callapi();
