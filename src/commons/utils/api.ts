import { HttpMethod } from '../types/httpmethods';

export async function apiFetch<T>(
url: string,
options: {
method?: HttpMethod;
body?: unknown;
headers?: HeadersInit;
} = {}
): Promise<T> {

const { method = "GET", body, headers } = options;

const response = await fetch(url, {
method,
headers: {
"Content-Type": "application/json",
...headers,
},
body: body !== undefined ? JSON.stringify(body) : undefined,
cache: "no-store",
});

if (!response.ok) {
const error = await response.json().catch(() => ({}));

throw new Error(
error.message || `Error HTTP ${response.status}`
);
}

return response.json();
}
