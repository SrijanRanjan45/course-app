const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const cors=require("cors");
dotenv.config();
const app = express();
const ObjectId = mongoose.Types.ObjectId;
app.use(express.json());
app.use(cors());

const secret = "@_@_@"; 
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

const userModel = mongoose.model('User', userSchema);
const adminModel = mongoose.model('Admin', adminSchema);
const courseModel = mongoose.model('Course', courseSchema);
const purchaseModel = mongoose.model('purchase', purchaseSchema);

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

mongoose.connect('mongodb+srv://admin:yEA5Q16kEJXSzlf9@cluster1.0x4b4.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));;


app.post('/admin/signup', async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
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

    const admin = await adminModel.findOne({
        email: email,
        password: password
    });

    if (admin) {
        const token = jwt.sign({
            id: admin._id
        }, secret);

        res.json({
            token: token
        })
    } else {
        res.status(403).json({
            message: "Incorrect credentials"
        })
    }
});

app.post('/admin/courses', async (req, res) => {
    try{
        const { title, description, price, imageUrl } = req.body;
        if (!title || !description || !price || !imageUrl) {
            return res.status(400).json({ message: "All fields are required." });
        }
        const course = await courseModel.create({
            title : title,
            description : description,
            price : price,
            imageUrl : imageUrl,
            creatorId: req.userId
        });

        res.json({
            message: 'Course added successfully',
            course
        });
    }
    catch(err){
        console.log("error");
        res.status(500).json({ message: "Internal server error" });
    }
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

app.post('/users/signup', async function(req, res) {
    const { email, password, firstName, lastName } = req.body; 
    console.log(req);
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

    const user = await userModel.findOne({
        email: email,
        password: password
    });
    if (user) {
        const token = jwt.sign({
            id: user._id,
        }, secret);

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

app.post('/users/courses/purchase', authMiddleware, async function(req, res) {
    const userId = req.userId;
    const courseId = req.body.courseId;
    console.log(courseId);
    await purchaseModel.create({
        userId : userId,
        courseId : courseId
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
    console.log(`Server is listening on port ${port}`);
});