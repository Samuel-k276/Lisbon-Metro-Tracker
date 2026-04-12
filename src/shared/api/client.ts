const API_BASE_URL = 'https://api.metrolisboa.pt:8243/estadoServicoML/1.0.1';

const API_TOKEN = import.meta.env.VITE_METRO_API_TOKEN;

const HEADERS = {
  Authorization: `Bearer ${API_TOKEN}`,
  accept: 'application/json',
};

const apiFetch = async (path: string): Promise<Response> => {
  const response = await fetch(`${API_BASE_URL}${path}`, { headers: HEADERS });
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }
  return response;
};

export { apiFetch };
