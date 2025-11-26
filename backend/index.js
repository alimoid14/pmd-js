import express from "express";

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("hello");
});

app.listen(PORT, ()=> {
    console.log("Server is runnning on port:", PORT);
})