import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://localhost:8180",
  realm: "agrisense",
  clientId: "agrisense-web",
});

export default keycloak;
