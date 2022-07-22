import routes from './routes';
import models from './models'

import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ 
    extended: true }));

app.use((req, res, next) => {
    req.context = {
        models,
    }

    next();
})

app.use('/api/auth', routes.auth);
app.use('/api/area', routes.testRoute);

export default app;