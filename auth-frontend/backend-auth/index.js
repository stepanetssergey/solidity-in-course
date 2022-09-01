import express from "express";
import { handleRequest } from "./api/handleRequest.js";
import cors from "cors";

const app = express();

// Middlewares
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(cors());

app.post("/auth", handleRequest);
//app.post("/message", handleMessageRequest);

const port = process.env.PORT || 8000;

app.listen(port, () =>
    console.log(`Express app listening on localhost:${port}`)
);
