import React from 'react';
import './style.css';

const Loading = ({match}) => {
  return (
    <div className="wrapper">
      <div className="succulent-box">
        {match.url.includes('/audi/') && <div className="loading-circle" />}
        <div className="stem"></div>
        <div className="leaf leaf01"></div>
        <div className="leaf leaf02">
          <div className="leaf02-green"></div>
        </div>
        <div className="leaf leaf03">
          <div className="leaf03-light"></div>
        </div>
        <div className="pot"></div>
        <div className="pot-top"></div>
      </div>
    </div>
  );
};

export default Loading;
