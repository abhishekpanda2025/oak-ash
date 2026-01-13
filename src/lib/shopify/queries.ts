import { storefrontApiRequest } from './api';
import type { ProductsResponse, ProductByHandleResponse, CartCreateResponse, ShopifyProduct } from './types';

// GraphQL Queries
const GET_PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          title
          description
          handle
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          options {
            name
            values
          }
        }
      }
    }
  }
`;

const GET_PRODUCT_BY_HANDLE_QUERY = `
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      description
      handle
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 50) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            availableForSale
            selectedOptions {
              name
              value
            }
          }
        }
      }
      options {
        name
        values
      }
    }
  }
`;

const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// API Functions
export async function getProducts(first: number = 20, query?: string): Promise<ShopifyProduct[]> {
  const response = await storefrontApiRequest<ProductsResponse>(GET_PRODUCTS_QUERY, {
    first,
    query,
  });
  return response.data.products.edges;
}

export async function getProductByHandle(handle: string) {
  const response = await storefrontApiRequest<ProductByHandleResponse>(GET_PRODUCT_BY_HANDLE_QUERY, {
    handle,
  });
  return response.data.productByHandle;
}

export interface CartLineItem {
  variantId: string;
  quantity: number;
}

export async function createStorefrontCheckout(items: CartLineItem[]): Promise<string> {
  const lines = items.map(item => ({
    quantity: item.quantity,
    merchandiseId: item.variantId,
  }));

  const response = await storefrontApiRequest<CartCreateResponse>(CART_CREATE_MUTATION, {
    input: { lines },
  });

  if (response.data.cartCreate.userErrors.length > 0) {
    throw new Error(`Cart creation failed: ${response.data.cartCreate.userErrors.map(e => e.message).join(', ')}`);
  }

  const cart = response.data.cartCreate.cart;

  if (!cart.checkoutUrl) {
    throw new Error('No checkout URL returned from Shopify');
  }

  // Add channel parameter for proper checkout access
  const url = new URL(cart.checkoutUrl);
  url.searchParams.set('channel', 'online_store');
  return url.toString();
}
