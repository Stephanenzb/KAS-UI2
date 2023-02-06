import React, { useState } from 'react';
import Navbar from './components/Navbar';
import './App.css';
import Home from './components/pages/Home';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import Contact from './components/pages/Contact';
import Profil from './components/pages/Profil'
import Dictaphone from './components/Dictaphone';
import Recorder from './components/Recorder';
import TranscriptionData from './components/TranscriptionData';
import Upload from './components/Upload';


function App() {
  return (
      <Router>
        <Navbar />
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/sign-up' component={Login} />
          <Route path='/contact' component={Contact}></Route>
          <Route path="/upload" component={Upload}></Route>
          <Route path='/dictaphone' component={Dictaphone}></Route>
          <Route path='/recorder' component={Recorder}></Route>
          <Route path='/TranscriptedAudio' component={TranscriptionData}></Route>
          <Route path='/profil' component={Profil}></Route>
        </Switch>
      </Router>
  );
}

export default App;
