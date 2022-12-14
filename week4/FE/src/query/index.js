import { gql } from '@apollo/client';

export const queryCollections = gql`
  {
    shop {
      collections(first: 6) {
        edges {
          node {
            id
            title
            image {
              url
            }
            products(first: 10) {
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
                  variants(first: 2) {
                    edges {
                      node {
                        title
                        price
                      }
                    }
                  }
                  priceRange {
                    minVariantPrice {
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const queryProductAll = gql`
  {
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
          variants(first: 2) {
            edges {
              node {
                title
                price
              }
            }
          }
          priceRange {
            minVariantPrice {
              currencyCode
            }
          }
        }
      }
    }
  }
`;

export const queryTags = gql`
  {
    shop {
      productTags(first: 10) {
        edges {
          node
        }
      }
    }
  }
`;
