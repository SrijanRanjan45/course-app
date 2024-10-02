import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../style.css'

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    setRole(storedRole);
  }, []);

  useEffect(() => {
    async function fetchCourses() {
      const response = await axios.get('http://localhost:3000/users/courses', {
        headers: { token: localStorage.getItem('token') },
      });
      setCourses(response.data.courses);
    }
    fetchCourses();
  }, []);

  const handleAddCourse = async () => {
    try {
      await axios.post(
        'http://localhost:3000/admin/courses',
        { title, description, price, imageUrl },
        {
          headers: { token: localStorage.getItem('token') },
        }
      );
      alert('Course added successfully');
    } catch (error) {
      alert('Failed to add course');
    }
  };

  const handlePurchaseCourse = async (courseId) => {
    try {
      await axios.post(
        `http://localhost:3000/users/courses/purchase`,
        {courseId},
        {
          headers: { token: localStorage.getItem('token') },
        }
      );
      alert('Course purchased successfully');
    } catch (error) {
      alert('Failed to purchase course');
    }
  };

  const handleMyCourses = () => {
    navigate('/mycourses'); 
  };

  return (
    <div className="courses-container">
      <h2>Courses</h2>
      {role === 'user' && (
        <button onClick={handleMyCourses} className="my-courses-button">
          My Courses
        </button>
      )}
      <div className="courses-list">
        {courses.map((course) => (
          <div key={course._id} className="course-item">
            <img src={course.imageUrl} alt={course.title} />
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <p>Price: ${course.price}</p>
            {role === 'user' && (
              <button onClick={() => handlePurchaseCourse(course._id)}>
                Purchase
              </button>
            )}
          </div>
        ))}
      </div>
      {role === 'admin' && (
        <div className="add-course-form">
          <h3>Add a New Course</h3>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Course Title"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Course Description"
          />
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Course Price"
          />
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Image URL"
          />
          <button onClick={handleAddCourse}>Add Course</button>
        </div>
      )}
    </div>
  );
};

export default Courses;
