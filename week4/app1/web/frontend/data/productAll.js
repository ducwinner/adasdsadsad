import axios from 'axios';

export const getProductAll = async () => {
  try {
    const response = await axios.post(
      'https://training-duc-nv.myshopify.com/admin/api/2022-07/graphql.json',
      {
        query: `{
        products(first: 20) {
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
              variants(first:2) {
                edges {
                  node {
                    title
                    price
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

    //filter data to Array

    const data = response.data.data.products.edges.map((e) => {
      if (e.node.images.edges.length > 0) {
        return {
          id: e.node.id,
          title: e.node.title,
          images: e.node.images.edges[0].node.url,
          variants: e.node.variants.edges,
        };
      } else {
        return {
          id: e.node.id,
          title: e.node.title,
          images: '',
          variants: e.node.variants.edges
        };
      }
    });

    console.log(data);

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getProductByTags = async (tags) => {
  let lstQuery = '';
  rule.forEach((e, index) => {
    if (index == 0) {
      lstQuery += `(tag:'${e}') `;
    } else {
      lstQuery += `OR (tag:'${e}')`;
    }
  });
  try {
    const data = await axios.post(
      'https://training-duc-nv.myshopify.com/admin/api/2022-07/graphql.json',
      {
        query: `{
          products(first: 10, query: "${lstQuery}") {
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
                      variants(first:2) {
                        edges {
                          node {
                            title
                            price
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
  } catch (error) {
    console.log(error);
  }
};

export const getProductByCollections = async (id) => {
  try {
    const data = await axios.post(
      'https://training-duc-nv.myshopify.com/admin/api/2022-07/graphql.json',
      {
        query: `{
          collection(id:"${id}") {
             products(first:10) {
              edges {
                node {
                  id
                  title
                  variants(first: 3) {
                    edges {
                      node {
                        price
                      }
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
  } catch (error) {
    console.log(error);
  }
};
