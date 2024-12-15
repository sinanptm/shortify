import express from 'express';
import connectDb from './config/connectDb';

const app = express();

app.get('/', (req, res) => {
    res.status(200).json({ message: "Hello there" });
});

app.listen(8000, () => {
    connectDb();
    console.log("Server start running");
});