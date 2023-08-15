const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
app.use(express.json());
var cors = require('cors');
app.use(cors());

const PORT = 5000;

// MongoDB 연결
mongoose.connect('mongodb+srv://Kimgrace:sir439@experiment.yistdbf.mongodb.net/experiment', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected..'))
.catch(err => console.log(err));

const ExperimentSchema = new mongoose.Schema({
    Topic:{
        type:String,
        required:true
    },
    Hypothesis:{
        type:String,
        required:true
    }
});

const Experiment = mongoose.model('Experiment', ExperimentSchema);

app.get('/', (req, res)=>{
    console.log("Hello!")
});

app.get('/api/experiments', (req, res) => {
    Experiment.find({})
        .then(experiments => res.json(experiments))
        .catch(err => res.status(500).json({ error: "Failed to fetch data" }));
});

app.get('/api/search', (req, res) => {
    const query = req.query.q;
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});