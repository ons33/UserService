
import express from 'express';
import bodyParser from 'body-parser';
import connectDataBase from "./config/MongoDb.js";
import dotenv from 'dotenv';
dotenv.config();
import session from 'express-session';
import { MemoryStore } from 'express-session';
import KeycloakConnect from 'keycloak-connect';
import cors from 'cors';
import * as userRoutes from './routes/userRoutes.js';
import {initializeKeycloak} from "./keycloack/keycloak.js";
import axios from "axios";

import competenceRoutes from './routes/competenceRoutes.js';
import experienceRoutes from './routes/experienceRoutes.js';
import educationRoutes from './routes/educationRoutes.js';



const app = express();
const port = process.env.PORT || 3001;
connectDataBase();




  
app.use(bodyParser.json());
app.use(cors());

app.use('/api/user', userRoutes.default);

app.use('/api/competences', competenceRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/educations', educationRoutes);




app.get('/', (req, res) => {
    res.send('Mouna && Ons Project PFE!');
});

app.listen(port, () => {
    console.log(`Serveur écoutant sur le port ${port}`);
});
