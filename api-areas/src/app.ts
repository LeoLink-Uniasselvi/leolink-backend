// src/app.ts
import express from 'express';
import cors from 'cors';
import { AppDataSource } from './database/data-source';
import { AreaController } from './controllers/AreaController';
import { AssociationController } from './controllers/AssociationController';

const app = express();
app.use(cors());
app.use(express.json());

// Áreas
app.get('/areas', AreaController.list);
app.get('/areas/:id', AreaController.getById);
app.post('/areas', AreaController.create);
app.patch('/areas/:id', AreaController.update);
app.delete('/areas/:id', AreaController.delete);

// Associações
app.post('/associate', AssociationController.associate);
app.delete('/associate', AssociationController.remove);
app.get('/users/:userId/areas', AssociationController.getUserAreas);
app.get('/areas/:areaId/users', AreaController.getUsers);

AppDataSource.initialize()
    .then(() => {
        app.listen(3000, () => {
            console.log('API rodando em http://localhost:3000');
        });
    })
    .catch(console.error);