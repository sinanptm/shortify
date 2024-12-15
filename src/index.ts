import express from 'express';

const app = express();

app.get('/', (req, res) => {
    res.status(200).json({ message: "Hello there" });
});

app.listen(8000, () => {
    console.log("Server start running");
});