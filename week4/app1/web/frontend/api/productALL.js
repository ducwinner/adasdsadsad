import axios from 'axios';

export const getProductAll = async () => {
  const data = await axios.post(
    'https://training-duc-nv.myshopify.com/admin/api/2022-07/graphql.json',
    {
      query: `{
        products(first: 100) {
          edges {
            node {
              id
              title
              images(first: 1) {
                edges {
                  node {
                    url
                  }
                }
              }
            }
          }
        }
      }`,
      variables: {},
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': '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',
      },
    }
  );

  return data.data.data;
};

export const getProductByRule = async (rule) => {
  const data = await axios.post(
    'https://training-duc-nv.myshopify.com/admin/api/2022-07/graphql.json',
    {
      query: `{
        products(first: 100) {
          edges {
            node {
              id
              title
              images(first: 1) {
                edges {
                  node {
                    url
                  }
                }
              }
            }
          }
        }
      }`,
      variables: {},
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': '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',
      },
    }
  );

  return data.data.data;
};
