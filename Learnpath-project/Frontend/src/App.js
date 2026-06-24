import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainNavbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
// import Courses from './pages/courses';
// import StudyMaterial from './pages/studymaterial';
import Profile from './pages/Profile';
import  Profilesetup from './pages/Profilesetup';
import Dashboard from './pages/Dashboard';
import OAuth2RedirectHandler from './components/OAuth2RedirectHandler';
import Psychometric from "./components/PshychometricTest/Pshychometric";
import PsychometricResult from "./components/PshychometricTest/PsychometricResult";
import { ThemeProvider } from './context/ThemeContext';
import FaqWidget from './components/FaqWidget';
import Recommendation from './components/Recommendation';
import IndustryTrends from './pages/industrytrends';

function App() { 
  const isLoggedIn = () => !!localStorage.getItem('accessToken');

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen transition-colors duration-200 relative pb-20">
          <MainNavbar />
          <div className="container mx-auto px-4 mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={isLoggedIn() ? <Navigate to="/dashboard" replace /> : <Login />} />
          {/* <Route
  path="/login"
  element={<h1>LOGIN WORKING</h1>}
/> */}

          <Route path="/signup" element={isLoggedIn() ? <Navigate to="/dashboard" replace /> : <Signup />} />
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/profile-setup" element={< Profilesetup/>} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
         <Route path="/psychometric-test" element={<Psychometric />} />
        <Route path="/psychometric-result" element={<PsychometricResult />} /> 
        <Route path="/recommendation" element={<Recommendation />} />
        <Route path="/industry-trends" element={<IndustryTrends />} />



          {/* <Route path="/courses" element={<Courses />} />
          <Route path="/study-material" element={<StudyMaterial />} />
          */}
          {/* <Route path="/industry-trends" element={<industrytrends />} /> */}
          
          </Routes>
        </div>

        {/* Render globally across app */}
        <FaqWidget />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
