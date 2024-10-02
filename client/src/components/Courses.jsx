import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch courses from the backend
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:3000/users/courses');
        setCourses(response.data.courses);
        setLoading(false);
      } catch (err) {
        setError('Failed to load courses');
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <p>Loading courses...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="courses-container">
      <h2>Available Courses</h2>
      <div className="courses-list">
        {courses.length > 0 ? (
          courses.map((course) => (
            <div key={course._id} className="course-card">
              <img src={course.imageUrl} alt={course.title} className="course-image" />
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <p><strong>Price:</strong> ${course.price}</p>
            </div>
          ))
        ) : (
          <p>No courses available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default Courses;
