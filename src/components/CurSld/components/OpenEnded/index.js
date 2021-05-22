import React, {Fragment} from 'react';
import './index.css';

const OpenEnded = (props) => {
  const {slds, curSldIndex} = props;
  let {qContent, openEndedRes} = slds[curSldIndex];

  return (
    <Fragment>
      <div className="qus-div" id="open-ended-qus">
        {qContent}
      </div>
      <div id="open-sld-content">
        {openEndedRes !== [] &&
          openEndedRes !== undefined &&
          openEndedRes.map((item, index) => (
            <div className="open-ended-item" key={index} title={item}>
              <p>{item}</p>
            </div>
          ))}
      </div>
    </Fragment>
  );
};

export default OpenEnded;
