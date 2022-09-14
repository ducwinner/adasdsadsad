import axios from 'axios';

export const getProductTags = async () => {
  const data = await axios.post(
    'https://training-duc-nv.myshopify.com/admin/api/2022-07/graphql.json',
    {
      query: `{
        shop {
            collections(first: 10) {
          edges {
            node {
              id
              title
              image {
                url
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
