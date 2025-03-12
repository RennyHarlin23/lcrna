const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
require('dotenv').config();
const NcRna = require('./models/NcRna');
const connection_url = process.env.MONGO_DB_URL;
mongoose.connect(connection_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
})
.catch((err) => {
    console.log(err);
}
);
const db = 
app.get('/ncrna/:symbol', async (req, res) => {
    const symbol = req.params.symbol;
    data = await NcRna.find({"ncRNA Symbol": symbol});
    const ncrna  = JSON.parse(JSON.stringify(data));
    res.send(ncrna.map(element => {
        return element['Disease Name'];
    }));
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    }
);