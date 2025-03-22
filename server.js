const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config(); // Add this line to load environment variables


console.log("Mongo URI:", process.env.MONGO_URI);
console.log("JWT Secret:", process.env.JWT_SECRET);
// Replace with your MongoDB Atlas connection string
const mongoURI = process.env.MONGO_URI;

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

// Define Signup schema and model
const signupSchema = new mongoose.Schema({
    email: String,
    password: String,
    token: String
});

const SignupInfo = mongoose.model('SignupInfo', signupSchema);

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

// API endpoint to retrieve a single portfolio by ID
app.get('/api/portfolios/:id', async (req, res) => {
    try {
        const portfolio = await Portfolio.findById(req.params.id);
        if (!portfolio) {
            return res.status(404).send('Portfolio not found');
        }
        res.status(200).send(portfolio);
    } catch (error) {
        res.status(400).send(error);
    }
});

// API endpoint to handle signup
app.post('/api/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newSignup = new SignupInfo({ email, password: hashedPassword });
        await newSignup.save();
        res.status(201).send(newSignup);
    } catch (error) {
        res.status(400).send(error);
    }
});

// API endpoint to handle login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await SignupInfo.findOne({ email });
        if (!user) {
            return res.status(400).send({ message: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        user.token = token;
        await user.save();
        res.status(200).send({ token });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ message: 'An error occurred while logging in. Please try again.' });
    }
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
