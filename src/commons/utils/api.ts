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
// si no que ultimamente todo lo que veo en internet son pedidos de shein pero super subidos de precio y es como dude, entonces mejor las compro directamente en el lugar. Shein ahora esta super caro, este buzo que tengo ahora me costó como 60-70, pero en una pagina de aca de colombia te hubiera costado 120, por eso te digo. La verdad, la ropa de shein es super cool, ah la verdad esq si, por eso tambien quiero ver como me va. es que mira esta calidad. puro nino vietnamita. chino. tailandes xdd. Loas asiaticos definitivamente son lo mejor. y son finalmente los que mejor estilo tienen asi en la calle fuera del entorno de la moda. TOTAL, sabes que ya me llego mi pedido de skincare coreano? waoowww y que trae, haz un haul. Acido azelaico, 