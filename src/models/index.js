import 'dotenv/config'
import mongoose from "mongoose";

import User from "./user";
import Role from './role';

const connectDB = () => {
    return mongoose.connect(process.env.MONGODB_URL)
        .then(() => {
            console.log("succesfully connected to database");
        }, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .catch((err) => {
            console.log(err)
        });
}

const models = { User, Role }

export { connectDB };

export default models;