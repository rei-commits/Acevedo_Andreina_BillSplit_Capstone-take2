require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const app = express();
const path = require('path');
const port = 5000;

app.use(cors()); 
app.use(express.json());
app.use(helmet()); // Add helmet for security

// Rate limiting middleware to prevent brute-force attacks
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

mongoose.connect(process.env.MONGO_URI, {
    //useNewUrlParser: true,
    //useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Registration endpoint
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).send('User already exists');
        }

        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ name, email, password: hashedPassword });
        await user.save();
        res.send('User registered successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('Invalid credentials');
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid credentials');
        }

        // Generate JWT
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.send(token);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Middleware to authenticate the token
const auth = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
};

// CRUD operations for bills (as an example, more routes can be added)
app.get('/api/bills', auth, async (req, res) => {
    try {
        const bills = await Bill.find();
        res.json(bills);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.post('/api/bills', auth, async (req, res) => {
    const { totalAmount, tipPercentage, customTipAmount, numberOfPeople, amountPerPerson } = req.body;

    try {
        const bill = new Bill({ totalAmount, tipPercentage, customTipAmount, numberOfPeople, amountPerPerson });
        await bill.save();
        res.json(bill);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(path.resolve(), "/client/build")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(path.resolve(), "client", "build", "index.html"));
    });
  } else {
    app.get("/", (req, res) => {
      res.send("API is running...");
    });
  }

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//Updated again