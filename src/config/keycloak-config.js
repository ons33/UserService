// config/keycloak-config.js

import session from 'express-session';
import Keycloak from 'keycloak-connect';

let _keycloak;

const keycloakConfig = {
  clientId: 'espritookService',
  bearerOnly: false,
  serverUrl: 'http://localhost:8080/auth',
  realm: 'EspritookKeycloak',
  credentials: {
    grantType: 'client_credentials',
        clientId: 'EspritookService',
  },
};
const initializeKeycloak = async () => {
  const Client = new KcAdminClient();

  Client.setConfig({
      realmName: 'EspritookKeycloak', // Utilisez le nom de votre realm où se trouve l'utilisateur admin
      baseUrl: 'http://localhost:8080/auth',
  });

  const credentials = {
      grantType: 'password',
      clientId: 'admin-cli',
      username: 'admin',
      password: 'Admin.1999',
  };

  await Client.auth(credentials);

  return Client;
};

function initKeycloak() {
  if (_keycloak) {
    console.warn('Trying to init Keycloak again!');
    return _keycloak;
  } else {
    console.log('Initializing Keycloak...');
    const memoryStore = new session.MemoryStore();
    _keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);
    return _keycloak;
  }
}

function getKeycloak() {
  if (!_keycloak) {
    console.error('Keycloak has not been initialized. Please call initKeycloak first.');
  }
  return _keycloak;
}

export { initKeycloak, getKeycloak };
