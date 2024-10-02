import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchCourses() {
      const token = localStorage.getItem('token');

      try {
        const response = await axios.get('http://localhost:3000/users/purchasedCourses', {
          headers: {
            token: token, 
          },
        });

        setCourses(response.data.coursesData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch courses');
        setLoading(false);
      }
    }

    fetchCourses();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>My Purchased Courses</h2>
      {courses.length > 0 ? (
        <ul>
          {courses.map(course => (
            <li key={course._id}>
              <h3>{course.title}</h3>
              <p>{course.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>You haven't purchased any courses yet.</p>
      )}
    </div>
  );
};

export default MyCourses;
