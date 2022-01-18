import React, {Fragment, useMemo} from 'react';
import colors from '../../../../lib/colors';
import ReactWordcloud from 'react-wordcloud';
import './index.css';

const defaultCloudOptions = {
  colors: colors,
  enableTooltip: true,
  deterministic: true,
  fontFamily: 'Noto Sans TC',
  fontStyle: 'normal',
  fontWeight: 'normal',
  padding: 1,
  rotations: 3,
  rotationAngles: [0, 0],
  scale: 'log',
  spiral: 'archimedean',
  transitionDuration: 1000,
};

const TagCloud = (props) => {
  const {slds, curSldIndex, isFullscreen} = props;
  const {tagRes, qContent} = slds[curSldIndex];
  const cloudData = Object.entries(tagRes)?.map((item) => {
    return {text: item[0].toString(), value: item[1]};
  });

  const cloudOptions = useMemo(
    () => ({...defaultCloudOptions, fontSizes: isFullscreen ? [30, 100] : [20, 60]}),
    [isFullscreen]
  );

  return (
    <Fragment>
      <div className="qus-div">{qContent}</div>
      <div id="cloud-sld-content">
        <ReactWordcloud options={cloudOptions} words={cloudData} />
      </div>
    </Fragment>
  );
};

export default TagCloud;
