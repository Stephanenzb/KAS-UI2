import React from 'react';
import './Cards.css';
import CardItem from './CardItem';
import StephaneSource from "../assets/images/stephane.jpg"

function Cards() {
  return (
    <div className='cards'>
      <div className='cards__container'>
        <div className='cards__wrapper'>
          <ul>
            <CardItem
              src={StephaneSource}
              text='Data BI Engineer'
              label='Stephane'
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Cards;
