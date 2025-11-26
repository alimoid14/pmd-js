import express from "express";
import { connectDB } from "./db/connectDB.js";
import dotenv from "dotenv";

const app = express();
app.use(express.json());
dotenv.config();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("hello");
});

app.listen(PORT, ()=> {
    connectDB();
    console.log("Server is runnning on port:", PORT);
})