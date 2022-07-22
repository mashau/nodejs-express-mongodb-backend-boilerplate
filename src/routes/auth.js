import { Router } from "express";
import controllers from "../controllers";
import middlewares from "../middlewares";

const router = Router();

router.post('/signin', controllers.auth.signIn);
router.post('/signup', [
    middlewares.verifySignUp.checkDuplicateUsernameOrEmail
], controllers.auth.signUp);

export default router;