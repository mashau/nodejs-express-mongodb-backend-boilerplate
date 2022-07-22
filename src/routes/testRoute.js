import { Router } from 'express'

import controllers from "../controllers";
import middlewares from '../middlewares';

const router = Router();

router.get('/public', controllers.testController.publicArea);

router.get('/user', [
    middlewares.authJWT.verifyToken
], controllers.testController.userArea);

router.get('/editor', [
    middlewares.authJWT.verifyToken,
    middlewares.authJWT.isAuthenticatedAndEditor
], controllers.testController.editorArea)

router.get('/admin', [
    middlewares.authJWT.verifyToken,
    middlewares.authJWT.isAuthenticatedAndAdmin
], controllers.testController.adminArea)

export default router;