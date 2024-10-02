// firstly, Don't get overwhelmed and if you are then go with client-easy.
import React from 'react';
import Home from "./pages/Home"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Courses from "./components/Courses";
import MyCourses from './components/Mycourses';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/mycourses" element={<MyCourses />} />
      </Routes>
    </Router>
  );
};

export default App;
