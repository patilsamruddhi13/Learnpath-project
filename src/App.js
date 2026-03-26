import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainNavbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
// import Courses from './pages/courses';
// import StudyMaterial from './pages/studymaterial';
import IndustryTrends from './pages/industrytrends';
import Profile from './pages/Profile';
import  Profilesetup from './pages/Profilesetup';
import Dashboard from './pages/Dashboard';
import OAuth2RedirectHandler from './components/OAuth2RedirectHandler';
import Psychometric from "./components/PshychometricTest/Pshychometric";
import PsychometricResult from "./components/PshychometricTest/PsychometricResult";
function App() { 
  return (
    <Router>
      <MainNavbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          {/* <Route
  path="/login"
  element={<h1>LOGIN WORKING</h1>}
/> */}

          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/profile-setup" element={< Profilesetup/>} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
         <Route path="/psychometric-test" element={<Psychometric />} />
        <Route path="/psychometric-result" element={<PsychometricResult />} /> 



          {/* <Route path="/courses" element={<Courses />} />
          <Route path="/study-material" element={<StudyMaterial />} />
          */}
          {/* <Route path="/industry-trends" element={<industrytrends />} /> */}
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
