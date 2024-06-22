
import 'cross-fetch/dist/node-polyfill.js';
import KcAdminClient from '@keycloak/keycloak-admin-client';
import axios from "axios";


const initializeKeycloak = async () => {
    try {
        const Client = new KcAdminClient();

        Client.setConfig({
            realmName: 'espritook',
            bearerOnly: false,
            baseUrl: 'http://localhost:8080/auth',
        });

        const credentials = {
            grantType: 'client_credentials',
            clientId: 'espritookService',
            clientSecret: '329498c0-8b30-4cb5-9709-bdce2e2d3558',
        };

        await Client.auth(credentials);

        return Client;
    } catch (error) {
        // Handle the error
        console.error('Error initializing Keycloak:', error);
        throw error; // Optionally rethrow the error for further handling
    }
};

const initiateResetPassword =
    async (email) => {
    try {
        const client = await initializeKeycloak();


        const response = await axios.get(
            `${client.baseUrl}/admin/realms/${client.realmName}/users`,
            {
                headers: {
                    'Authorization': `Bearer ${await client.getAccessToken()}`,
                    'Content-Type': 'application/json',
                },
                params: {
                    email: email,
                },
            }
        );
        console.log(response,"response");

        const users = response.data;

        if (!users || users.length === 0) {
            console.error(`User with email ${email} not found`);
            return false;
        }

        const userId = users[0].id;

        // Manually construct the request body
        const requestBody = {
            actions: ['UPDATE_PASSWORD'],
        };

        // Perform the password reset for the user
        await axios.put(
            `${client.baseUrl}/admin/realms/${client.realmName}/users/${userId}/reset-password-email`,
            requestBody,
            {
                headers: {
                    'Authorization': `Bearer ${await client.getAccessToken()}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log(`Password reset initiated for user with email ${email}`);
        return true;
    } catch (error) {
        console.error(`Error initiating reset password for user with email ${email}:`, error);
        return false;
    }
};



export { initializeKeycloak,initiateResetPassword};
