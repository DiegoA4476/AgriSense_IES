import keycloak from "@/lib/keycloak";

export async function authFetch(input: RequestInfo, init: RequestInit = {}) {
  await keycloak.updateToken(30).catch(() => keycloak.login());

  return fetch(input, {
    ...init,
    headers: {
      ...init.headers,
      Authorization: `Bearer ${keycloak.token}`,
    },
  });
}
