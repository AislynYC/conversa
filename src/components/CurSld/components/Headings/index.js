import React, {Fragment, useState, useEffect, useMemo, useRef} from 'react';
import {FormattedMessage} from 'react-intl';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import QRCode from 'qrcode.react';
import './index.css';

const qrCodeImgSize = {height: 45, width: 45};
const fullScreenQrCodeImgSize = {height: 100, width: 100};

const qrCodeImageUrl =
  'https://firebasestorage.googleapis.com/v0/b/conversa-a419b.appspot.com/o/logoC_nb.png?alt=media&token=444f79ff-ef6f-4bfd-a379-316da82b2be2';

const Headings = (props) => {
  const {slds, curSldIndex, isFullscreen, reaction, projId} = props;
  const curSld = slds[curSldIndex];
  const isFirstRender = useRef(true);
  const [reactionClass, setReactionClass] = useState('reaction-icon');

  const qrCodeImageSettings = useMemo(
    () => ({
      src: qrCodeImageUrl,
      x: null,
      y: null,
      height: isFullscreen ? fullScreenQrCodeImgSize.height : qrCodeImgSize.height,
      width: isFullscreen ? fullScreenQrCodeImgSize.width : qrCodeImgSize.width,
      excavate: true,
    }),
    [isFullscreen]
  );

  useEffect(() => {
    if (isFirstRender) {
      isFirstRender.current = false;
    } else {
      setReactionClass('reaction-icon scale');
    }
    const timer = setTimeout(() => {
      setReactionClass('reaction-icon');
    }, 300);

    return () => clearTimeout(timer);
  }, [reaction.laugh]);

  return (
    <div className="heading-render-container">
      <div className="heading-render">{curSld.heading}</div>
      <Fragment>
        {curSld.hasQRCode ? (
          <div className="qr-code">
            <Fragment>
              <div
                className={
                  isFullscreen ? 'fullscreenFontSize scan-to-join' : 'scan-to-join'
                }>
                <FormattedMessage id="edit.scan-to-join" />
                <FontAwesomeIcon icon={['far', 'hand-point-right']} size="lg" />
              </div>
              <QRCode
                value={`https://conversa-a419b.firebaseapp.com/audi/${projId}`}
                size={isFullscreen ? 500 : 230}
                imageSettings={qrCodeImageSettings}
              />
            </Fragment>
          </div>
        ) : (
          <div>{curSld.subHeading}</div>
        )}
      </Fragment>
      <div>
        <FontAwesomeIcon icon={['fas', 'heart']} className={reactionClass} />
        <span className="reaction-count">{reaction.laugh}</span>
      </div>
    </div>
  );
};

export default Headings;
