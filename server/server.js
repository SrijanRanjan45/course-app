const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const ObjectId = mongoose.Types.ObjectId;
app.use(express.json());

const secret = process.env.JWT_SECRERT; 
const port = 3000;

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    password: String,
    firstName: String,
    lastName: String,
});

const adminSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    password: String,
    firstName: String,
    lastName: String,
});

const courseSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    imageUrl: String,
    creatorId: ObjectId
});

const purchaseSchema = new mongoose.Schema({
    userId: ObjectId,
    courseId: ObjectId
});

// Define mongoose models
const userModel = mongoose.model('User', userSchema);
const adminModel = mongoose.model('Admin', adminSchema);
const courseModel = mongoose.model('Course', courseSchema);
const purchaseModel = mongoose.model("purchase", purchaseSchema);

const authMiddleware = (req, res, next) => {
    const token = req.headers.token;
    const decoded = jwt.verify(token, secret);

    if (decoded) {
        req.userId = decoded.id;
        next()
    } else {
        res.status(403).json({
            message: "You are not signed in"
        })
    }
};

// Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017');
app.get('/', (req, res) => {
    res.send('Server is running!');
});


// Admin routes
app.post('/admin/signup', async (req, res) => {
    const { email, password, firstName, lastName } = req.body; // TODO: adding zod validation
    // TODO: hash the password so plaintext pw is not stored in the DB

    // TODO: Put inside a try catch block
    await adminModel.create({
        email: email,
        password: password,
        firstName: firstName, 
        lastName: lastName
    })
    
    res.json({
        message: "Signup succeeded"
    })
});

app.post('/admin/login', async function(req, res) {
    const { email, password } = req.body;

    // TODO: ideally password should be hashed, and hence you cant compare the user provided password and the database password
    const admin = await adminModel.findOne({
        email: email,
        password: password
    });

    if (admin) {
        const token = jwt.sign({
            id: admin._id
        }, secret);

        // Do cookie logic

        res.json({
            token: token
        })
    } else {
        res.status(403).json({
            message: "Incorrect credentials"
        })
    }
});

app.post('/admin/courses', authMiddleware, (req, res) => {
    // logic to create a course
});

app.put('/admin/courses/:courseId',  async function(req, res) {
    const adminId = req.userId;

    const { title, description, imageUrl, price, courseId } = req.body;

    const course = await courseModel.updateOne({
        _id: courseId, 
        creatorId: adminId 
    }, {
        title: title, 
        description: description, 
        imageUrl: imageUrl, 
        price: price
    })

    res.json({
        message: "Course updated",
        courseId: course._id
    })
});

app.get('/admin/courses', async function(req, res) {
    const adminId = req.userId;

    const courses = await courseModel.find({
        creatorId: adminId 
    });

    res.json({
        message: "Course updated",
        courses
    })
});

// User routes
app.post('/users/signup', async function(req, res) {
    const { email, password, firstName, lastName } = req.body; // TODO: adding zod validation
    // TODO: hash the password so plaintext pw is not stored in the DB
    console.log(req);
    // TODO: Put inside a try catch block
    await userModel.create({
        email: email,
        password: password,
        firstName: firstName, 
        lastName: lastName
    })
    
    res.json({
        message: "Signup succeeded"
    })
});

app.post('/users/login', async function(req, res) {
    const { email, password } = req.body;

    // TODO: ideally password should be hashed, and hence you cant compare the user provided password and the database password
    const user = await userModel.findOne({
        email: email,
        password: password
    }); //[]

    if (user) {
        const token = jwt.sign({
            id: user._id,
        }, JWT_USER_PASSWORD);

        // Do cookie logic

        res.json({
            token: token
        })
    } else {
        res.status(403).json({
            message: "Incorrect credentials"
        })
    }
});

app.get('/users/courses', async function(req, res) {
    
    const courses = await courseModel.find({});

    res.json({
        courses
    })
});

app.post('/users/courses/:courseId', authMiddleware, async function(req, res) {
    const userId = req.userId;
    const courseId = req.body.courseId;

    // should check that the user has actually paid the price
    await purchaseModel.create({
        userId,
        courseId
    })

    res.json({
        message: "You have successfully bought the course"
    })
});

app.get('/users/purchasedCourses', authMiddleware, async function(req, res) {
    const userId = req.userId;

    const purchases = await purchaseModel.find({
        userId,
    });

    let purchasedCourseIds = [];

    for (let i = 0; i<purchases.length;i++){ 
        purchasedCourseIds.push(purchases[i].courseId)
    }

    const coursesData = await courseModel.find({
        _id: { $in: purchasedCourseIds }
    })

    res.json({
        purchases,
        coursesData
    })
});

app.listen(port, () => {
    console.log('Server is listening on port 3000');
});