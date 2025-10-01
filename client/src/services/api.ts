const API_BASE_URL = 'http://localhost:4000/api';

const getAuthToken = () => {
  // Get token from localStorage for authenticated requests
  return localStorage.getItem('token');
};

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();

  // Build headers safely
  let headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  // If body is an object and not FormData, stringify and set JSON headers
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    console.error('API Error:', response.status, response.statusText, data);
    throw new Error(
      `API Error: ${response.status} ${response.statusText} - ${JSON.stringify(
        data
      )}`
    );
  }

  return data;
};

// ----------------- Product Endpoints -----------------
export const fetchProducts = async () => {
  const response = await apiRequest('/products');
  // Extract products array if backend wraps it
  const products = response.products || response || [];
  // Map _id to id for frontend consistency
  return products.map((product: any) => ({
    ...product,
    id: product._id,
    type: product.category, // Map backend category to frontend type
    costPrice: product.cost, // Map backend cost to frontend costPrice
    category: undefined, // Remove backend category
    cost: undefined, // Remove backend cost
    _id: undefined // Optional: remove _id to avoid confusion
  }));
};

export const createProduct = (productData: any) =>
  apiRequest('/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  });

export const updateProduct = (productId: string, productData: any) =>
  apiRequest(`/products/${productId}`, {
    method: 'PUT',
    body: JSON.stringify(productData),
  });

export const deleteProduct = (productId: string) =>
  apiRequest(`/products/${productId}`, {
    method: 'DELETE',
  });

export const fetchProduct = (productId: string) =>
  apiRequest(`/products/${productId}`).then((response: any) => ({
    ...response.product,
    id: response.product._id,
    type: response.product.category, // Map backend category to frontend type
    costPrice: response.product.cost, // Map backend cost to frontend costPrice
    category: undefined, // Remove backend category
    cost: undefined, // Remove backend cost
    _id: undefined // Optional: remove _id to avoid confusion
  }));

export const updateProductStock = (productId: string, stockData: any) =>
  apiRequest(`/products/${productId}/stock`, {
    method: 'POST',
    body: JSON.stringify(stockData),
  });

export const fetchLowStockProducts = () => apiRequest('/products/low-stock');

// ----------------- Sales Endpoints -----------------
export const createSale = (saleData: any) =>
  apiRequest('/sales', {
    method: 'POST',
    body: JSON.stringify(saleData),
  });

// ----------------- Auth Endpoints -----------------
export const registerUser = (userData: any) =>
  apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });

export const loginUser = (credentials: { email: string; password: string }) =>
  apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

// ----------------- Customers -----------------
export const fetchCustomers = async () => {
  const response = await apiRequest('/customers');
  // Map _id to id for frontend consistency
  return response.map((customer: any) => ({
    ...customer,
    id: customer._id,
    _id: undefined // Optional: remove _id to avoid confusion
  }));
};

export const getCustomer = (customerId: string) =>
  apiRequest(`/customers/${customerId}`).then((response: any) => ({
    ...response,
    id: response._id,
    _id: undefined
  }));

export const createCustomer = (customerData: any) =>
  apiRequest('/customers', {
    method: 'POST',
    body: JSON.stringify(customerData),
  });

export const updateCustomer = (customerId: string, customerData: any) =>
  apiRequest(`/customers/${customerId}`, {
    method: 'PUT',
    body: JSON.stringify(customerData),
  });

export const deleteCustomer = (customerId: string) =>
  apiRequest(`/customers/${customerId}`, {
    method: 'DELETE',
  });
