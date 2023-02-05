import React from 'react';
import '../App.css';
import { Button } from './Button';
import './HeroSection.css';
import videoSource from '../assets/videos/video-1.mp4';

function HeroSection() {
  return (
    <div className='hero-container'>
      <video autoPlay loop muted  >
        <source src={videoSource} type='video/mp4'/>
      </video>  
      <h1>UN CONCEPT HORS PAIRE</h1>
      <p>Venez vite découvrir</p>
      <div className='hero-btns'>
        <Button
          className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn--large'
          path='profil'
        >
          COMMENCEZ
        </Button>
      </div>
    </div>
  );
}

export default HeroSection;
