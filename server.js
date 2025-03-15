const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Replace with your MongoDB Atlas connection string
const mongoURI = 'mongodb+srv://tasmimdead:mangotas@cluster0.ead5r.mongodb.net/portfolioDB?retryWrites=true&w=majority&appName=Cluster0';

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Define Portfolio schema and model
const portfolioSchema = new mongoose.Schema({
    fullName: String,
    contactInfo: String,
    bio: String,
    skills: String,
    education: String,
    experience: String,
    projects: String,
    imagePreview: String
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

// API endpoint to save portfolio
app.post('/api/portfolios', async (req, res) => {
    try {
        const newPortfolio = new Portfolio(req.body);
        await newPortfolio.save();
        res.status(201).send(newPortfolio);
    } catch (error) {
        res.status(400).send(error);
    }
});

// API endpoint to retrieve portfolios
app.get('/api/portfolios', async (req, res) => {
    try {
        const portfolios = await Portfolio.find();
        res.status(200).send(portfolios);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
