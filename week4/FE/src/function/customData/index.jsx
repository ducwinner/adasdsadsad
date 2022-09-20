export const customProductAll = (response) => {
  const data = response.products.edges.map((e) => {
    const id = e.node.id;
    const title = e.node.title;
    const isUrl = e.node.images.edges.length > 0;
    const images = isUrl ? e.node.images.edges[0].node.url : '';
    const amountVariant = e.node.variants.edges.length;
    const variant1 = e.node.variants.edges[0].node;
    const variant2 = e.node.variants.edges[amountVariant - 1].node;
    const currency = e.node.priceRange.minVariantPrice.currencyCode
    if (amountVariant == 1) {
      return {
        id,
        title,
        images,
        variants: [variant1],
        currency
      };
    } else if (variant1.price !== variant2.price) {
      return {
        id,
        title,
        images,
        variants: [variant1, variant2],
        currency
      };
    } else {
      return {
        id,
        title,
        images,
        variants: [variant1],
        currency
      };
    }
  });

  return data;
};

export const customCollections = (response) => {
  const data = response.shop.collections.edges.map((e) => {
    const id = e.node.id;
    const title = e.node.title;
    const products = customProductAll(e.node);
    if (e.node.images) {
      return {
        id,
        title,
        images: e.node.images.edges[0].node.url,
        products,
      };
    } else {
      return {
        id,
        title,
        images: '',
        products,
      };
    }
  });

  return data;
};


export const customProductsByTags = (response) => {
  const data = response.data.products.edges.map((e) => {
    const id = e.node.id;
    const title = e.node.title;
    const amountVariant = e.node.variants.edges.length;
    const variant1 = e.node.variants.edges[0].node;
    const variant2 = e.node.variants.edges[amountVariant - 1].node;
    const currency = e.node.priceRange.minVariantPrice.currencyCode
    if (amountVariant == 1) {
      return {
        id,
        title,
        variants: [variant1],
        currency
      };
    } else if (variant1.price !== variant2.price) {
      return {
        id,
        title,
        variants: [variant1, variant2],
        currency
      };
    } else {
      return {
        id,
        title,
        variants: [variant1],
        currency
      };
    }
  });

  return data;
};

