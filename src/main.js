import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

const app = express();
app.use(express.json);
app.use(bodyParser.json);
app.use(cors());

const port = 5001;

app.get('/', async(req, res) => {
    res.send('Hello World from API.')
})

app.listen(port, () => {
    console.log(`Server listening at http://127.0.0.1:${port}`);
})
