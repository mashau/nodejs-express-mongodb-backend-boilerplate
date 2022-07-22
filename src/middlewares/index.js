import authJWT from "./authJWT";
import verifySignUp from "./verifySignUp";

const middlewares = { authJWT, verifySignUp }

export default middlewares;