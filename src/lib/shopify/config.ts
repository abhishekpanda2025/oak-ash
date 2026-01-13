// Shopify Storefront API Configuration
export const SHOPIFY_CONFIG = {
  storeDomain: 'oak-ash-refined-ztzpw.myshopify.com',
  storefrontAccessToken: '3b183d1ffbd8f629ecde84fb64b0938a',
  apiVersion: '2025-07',
} as const;

export const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_CONFIG.storeDomain}/api/${SHOPIFY_CONFIG.apiVersion}/graphql.json`;
