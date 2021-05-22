import React, {useState, useEffect} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import colors from '../../lib/colors';
import './curSld.css';
import Headings from './components/Headings';
import MultiSelect from './components/MultiSelect';
import OpenEnded from './components/OpenEnded';
import TagCloud from './components/TagCloud';

const CurSld = (props) => {
  const {slds, curSldIndex, respondedAudi, switchNextSld, switchPrevSld, involvedAudi} =
    props;
  const curSldType = slds[curSldIndex].sldType;
  const sldRespondedAudi = respondedAudi[slds[curSldIndex].id];
  const [isFullscreen, setIsFullscreen] = useState(false);

  const monitorFullscreen = () => {
    if (document.fullscreenElement) {
      setIsFullscreen(true);
    } else {
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('fullscreenchange', monitorFullscreen);

    return () => {
      document.removeEventListener('fullscreenchange', monitorFullscreen);
    };
  });

  const clickFullscreen = () => {
    if (isFullscreen === true && slds !== undefined && curSldIndex !== undefined) {
      switchNextSld();
    }
  };

  const sldContent = () => {
    switch (curSldType) {
      case 'heading-page':
        return <Headings {...props} isFullscreen={isFullscreen} />;
      case 'multiple-choice':
        return <MultiSelect {...props} colors={colors} isFullscreen={isFullscreen} />;
      case 'open-ended':
        return <OpenEnded {...props} isFullscreen={isFullscreen} />;
      case 'tag-cloud':
        return <TagCloud {...props} isFullscreen={isFullscreen} />;
      default:
        return null;
    }
  };

  return (
    <div id="current-sld-container">
      <div id="current-sld-border">
        <div id="current-sld" onClick={clickFullscreen}>
          {sldContent}
          <div className="member-info">
            {curSldType !== 'heading-page' && (
              <div className="hand-group">
                <FontAwesomeIcon icon={['fas', 'hand-paper']} id="hand-icon" />
                {sldRespondedAudi ? sldRespondedAudi.length : '0'}
              </div>
            )}
            <FontAwesomeIcon icon={['fas', 'user']} id="member-icon" />
            {involvedAudi.length}
          </div>
          <a className="prev" onClick={switchPrevSld}>
            &#10094;
          </a>
          <a className="next" onClick={switchNextSld}>
            &#10095;
          </a>
        </div>
      </div>
    </div>
  );
};

export default CurSld;
