const { GraphQLClient, gql } = require("graphql-request");

const getProductByTags = async (ctx) => {
  const tags = ctx.request.body.tags;

  if (!tags) {
    ctx.response.status = 500;
    ctx.body = { errCode: 1, message: "bad request" };
    return;
  }

  let data = await main(tags);

  ctx.body = data;
  ctx.response.status = 200;
};

async function main(tags) {
  const endpoint =
    "https://training-duc-nv.myshopify.com/admin/api/2022-07/graphql.json";

  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": "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",
    },
  });

  let lstQuery = "";
  tags.forEach((e, index) => {
    if (index == 0) {
      lstQuery += `(tag:'${e}') `;
    } else {
      lstQuery += `OR (tag:'${e}')`;
    }
  });

  const query = gql`
   {
        products(first: 10, query: "${lstQuery}") {
                edges {
                  node {
                    id
                    title
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
      }
  `;

  const data = await graphQLClient.request(query);
  return data;
}

module.exports = {
  getProductByTags,
};
