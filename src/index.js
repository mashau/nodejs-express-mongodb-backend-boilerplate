import 'dotenv/config';
import express from 'express';

const app = express();

app.listen(process.env.PORT, () => {
    console.log("server listening on port:", process.env.PORT);
})

