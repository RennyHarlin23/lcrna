const express = require('express');
const app = express();
const port = 4000;
const mongoose = require('mongoose');
const NcRna = require('./models/NcRna');
const cors = require('cors');

app.use(cors());
app.use(express.json());
require('dotenv').config();
const connection_url = process.env.MONGO_DB_URL;

mongoose.connect(connection_url)
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((err) => {
    console.log(err);
}
);
app.get('/hello', (req, res) => {
    res.json({message: 'Hello World!'});
});

app.get('/lncrna/:seq/disease/:dis', async(req, res) => {
    const seq_id = req.params.seq;
    const disease = req.params.dis;
    let ncrna = []
    
    if (seq_id === 'Nil' && disease !== 'Nil') {
        const data = await NcRna.find({ "Disease Name": disease });
        ncrna.push(JSON.parse(JSON.stringify(data)));
    } else if (disease === 'Nil' && seq_id !== 'Nil') {
        const data = await NcRna.find({ "ncRNA Symbol": seq_id });
        ncrna.push(JSON.parse(JSON.stringify(data)));
    } else {
        const data = await NcRna.find({ "ncRNA Symbol": seq_id, "Disease Name": disease });
        ncrna.push(JSON.parse(JSON.stringify(data)));
    }
    
    res.send(ncrna[0]);    
});

// Endpoint to get all diseases associated with a given ncRNA symbol
app.get('/ncrna/:symbol', async (req, res) => {
    const symbol = req.params.symbol;
    data = await NcRna.find({"ncRNA Symbol": symbol});
    const ncrna  = JSON.parse(JSON.stringify(data));
    res.send(ncrna.map(element => {
        return element['Disease Name'];
    }));
});

// Endpoint to get all ncRNA symbols associated with a given disease
app.get('/disease/:name', async (req, res) => {
    const name = req.params.name;
    data = await NcRna.find({"Disease Name": name});
    const ncrna  = JSON.parse(JSON.stringify(data));
    res.send(ncrna.map(element => {
        return element['ncRNA Symbol'];
    }));
});
app.get('/all', async (req, res) => {
    data = await NcRna.find({});
    res.json(data);
})
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    }
);