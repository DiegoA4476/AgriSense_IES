import keycloak from "@/lib/keycloak";

const BASE_URL = "http://localhost:8080";

export async function authFetch(input: RequestInfo, init: RequestInit = {}) {
  await keycloak.updateToken(30).catch(() => keycloak.login());

  const url = typeof input === "string" ? `${BASE_URL}${input}` : input;

  return fetch(url, {
    ...init,
    headers: {
      ...init.headers,
      Authorization: `Bearer ${keycloak.token}`,
    },
  });
}
