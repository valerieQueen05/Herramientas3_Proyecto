import { HttpMethod } from '../types/httpmethods';

const isFormData = (value: unknown): value is FormData =>
  typeof FormData !== "undefined" && value instanceof FormData;

export async function apiFetch<T>(
  url: string,
  options: {
    method?: HttpMethod;
    body?: unknown;
    headers?: HeadersInit;
  } = {}
): Promise<T> {
  const { method = "GET", body, headers } = options;

  const bodyIsFormData = isFormData(body);
  const requestBody: BodyInit | undefined =
    body === undefined ? undefined : bodyIsFormData ? body : JSON.stringify(body);

  const response = await fetch(url, {
    method,
    headers: bodyIsFormData
      ? headers
      : {
          "Content-Type": "application/json",
          ...headers,
        },
    body: requestBody,
    cache: "no-store",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Error HTTP ${response.status}`);
  }

  return response.json();
}