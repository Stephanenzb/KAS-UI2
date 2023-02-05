import React, { useState } from 'react';
import Navbar from './components/Navbar';
import './App.css';
import Home from './components/pages/Home';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import Contact from './components/pages/Contact';
import Profil from './components/pages/Profil'
import Auth from "./components/contextes/Auth";
import Dictaphone from './components/Dictaphone';
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import { hasAuthenticated } from './components/services/AuthApi';
import Recorder from './components/Recorder';
import TranscriptionData from './components/TranscriptionData';
import Upload from './components/Upload';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(hasAuthenticated);
  return (
    <Auth.Provider value={{isAuthenticated, setIsAuthenticated}}>
      <Router>
        <Navbar />
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/sign-up' component={Login} />
          <Route path='/contact' component={Contact}></Route>
          <AuthenticatedRoute path="/upload" component={Upload}></AuthenticatedRoute>
          <AuthenticatedRoute path='/dictaphone' component={Dictaphone}></AuthenticatedRoute>
          <AuthenticatedRoute path='/recorder' component={Recorder}></AuthenticatedRoute>
          <AuthenticatedRoute path='/TranscriptedAudio' component={TranscriptionData}></AuthenticatedRoute>
          <AuthenticatedRoute path='/profil' component={Profil}></AuthenticatedRoute>
        </Switch>
      </Router>
    </Auth.Provider>
  );
}

export default App;
