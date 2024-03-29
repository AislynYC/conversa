import React, {useEffect, Fragment, useState} from 'react';
import {Router, Switch, Route, Redirect} from 'react-router-dom';
import {useFirestore} from 'react-redux-firebase';
import {createBrowserHistory} from 'history';
import {FormattedMessage} from 'react-intl';

import Loading from '../../components/Loading';
import Header from '../Header/Header';
import CurSld from '../../components/CurSld/CurSld';
import SldSelector from './SldSelector';
import ControlPanel from './ControlPanel';
import EditPanel from './EditPanel';
import {writeDbUser} from '../../lib/writeDb';
import './sldEditor.css';

import '../../lib/icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CloseIcon from '@material-ui/icons/Close';

const history = createBrowserHistory();

const SldEditor = (props) => {
  let dbRequestedObj = props.firestore.status.requested;
  let isInvtCollRequested = dbRequestedObj.invitation;
  let isUserCollRequested = () => {
    // to get requested boolean of user-projects sub-collection
    for (let prop in dbRequestedObj) {
      if (prop.endsWith('projects')) {
        return dbRequestedObj[prop];
      }
    }
    return null;
  };

  if (!isInvtCollRequested || !isUserCollRequested || props.slds === undefined) {
    return <Loading {...props} />;
  } else if (isInvtCollRequested && isUserCollRequested && props.slds === null) {
    return <Redirect to="/*" />;
  }

  if (props.auth.isLoaded && props.auth.isEmpty) {
    return <Redirect to="/" />;
  }

  const db = useFirestore();
  const userId = props.userId;
  const projId = props.projId;

  const handleKeydown = (e) => {
    if (e.target.tagName !== 'INPUT') {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        switchNextSld();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        switchPrevSld();
      }
    }
  };

  const selectSld = (selIndex) => {
    if (selIndex !== props.curSldIndex) {
      return writeDbUser(
        db,
        userId,
        projId,
        'updateProjDoc',
        {curSldIndex: selIndex},
        () => {
          if (selIndex === 0) {
            history.push(`${props.match.url}`);
          } else {
            history.push(`${props.match.url}/${selIndex}`);
          }
        }
      );
    }
  };

  const switchNextSld = () => {
    if (props.curSldIndex < props.slds.length - 1) {
      return writeDbUser(
        db,
        userId,
        projId,
        'updateProjDoc',
        {curSldIndex: props.curSldIndex + 1},
        () => {
          if (!document.fullscreenElement) {
            history.push(`${props.match.url}/${props.curSldIndex + 1}`);
          }
        }
      );
    }
  };

  const switchPrevSld = () => {
    if (props.curSldIndex > 0) {
      return writeDbUser(
        db,
        userId,
        projId,
        'updateProjDoc',
        {curSldIndex: props.curSldIndex - 1},
        () => {
          if (!document.fullscreenElement) {
            if (props.curSldIndex - 1 === 0) {
              history.push(`${props.match.url}`);
            } else {
              history.push(`${props.match.url}/${props.curSldIndex - 1}`);
            }
          }
        }
      );
    }
  };

  useEffect(() => {
    let url = props.location.pathname;
    let urlSplitArr = url.split('/');
    let urlLastSplit = urlSplitArr[urlSplitArr.length - 1];
    // Each time enter this page, the UseEffect function will check the URL path
    if (/^\d{1,2}$/.test(urlLastSplit) && urlLastSplit < props.slds.length) {
      // if the URL path contained page number info and the slide index exists, this will update the curSldIndex according to the URL path
      history.push(`${props.match.url}/${parseInt(urlLastSplit)}`);
      writeDbUser(
        db,
        userId,
        projId,
        'updateProjDoc',
        {
          curSldIndex: parseInt(urlLastSplit),
        },
        null
      );
    } else {
      // if the URL path does not contained page number info, this will update the curSldIndex to 0 (i.e. the first page)
      history.push(`${props.match.url}`);
      writeDbUser(
        db,
        userId,
        projId,
        'updateProjDoc',
        {
          curSldIndex: 0,
        },
        null
      );
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeydown);
    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [handleKeydown]);

  const [previewClass, setPreviewClass] = useState('preview-container hide');
  const showPreview = () => {
    setPreviewClass('preview-container');
  };
  const hidePreview = () => {
    setPreviewClass('preview-container hide');
  };

  const [mobileControlClass, setMobileControlClass] = useState(
    'center-wrap mobile-control-panel'
  );
  const showMobileControl = () => {
    setMobileControlClass('center-wrap mobile-control-panel show');
  };

  const hideMobileControl = () => {
    setMobileControlClass('center-wrap mobile-control-panel');
  };

  return (
    <Fragment>
      <Header
        {...props}
        locale={props.locale}
        setLocale={props.setLocale}
        showPreview={showPreview}
      />
      <Router history={history}>
        <div className="container">
          <SldSelector
            {...props}
            selectSld={selectSld}
            showMobileControl={showMobileControl}
          />
          <Switch>
            <SldPage
              {...props}
              switchNextSld={switchNextSld}
              mobileControlClass={mobileControlClass}
              hideMobileControl={hideMobileControl}
            />
          </Switch>
        </div>
        <DelSld {...props} selectSld={selectSld} />
      </Router>
      <div className={previewClass}>
        <FontAwesomeIcon
          icon={['fas', 'times']}
          id="preview-close-btn"
          onClick={hidePreview}
        />
        <CurSld {...props} switchNextSld={switchNextSld} switchPrevSld={switchPrevSld} />
      </div>
    </Fragment>
  );
};
export default SldEditor;

const SldPage = (props) => {
  return props.slds.map((sld, index) => {
    let path = null;
    index === 0
      ? (path = {exact: true, path: `${props.match.url}`})
      : (path = {path: `${props.match.url}/${index}`});

    return (
      <Route {...path} key={index}>
        <div className={props.mobileControlClass}>
          <div className="center">
            <CurSld
              {...props}
              switchNextSld={props.switchNextSld}
              switchPrevSld={props.switchPrevSld}
            />
            <ControlPanel
              {...props}
              sld={sld}
              editor={<EditPanel {...props} sld={sld} sldIndex={index} />}
              hideMobileControl={props.hideMobileControl}
            />
          </div>
        </div>
        <EditPanel {...props} sld={sld} sldIndex={index} />
      </Route>
    );
  });
};

const DelSld = (props) => {
  const db = useFirestore();
  const [isBtnDisabled, setIsBtnDisabled] = useState(false);

  useEffect(() => {
    setIsBtnDisabled(false);
  }, []);

  const deleteSld = (index) => {
    // use splice to delete the slide of the index parameter
    if (props.slds.length > 1) {
      let newSelected = null;
      if (index === 0) {
        newSelected = 0;
      } else {
        newSelected = index - 1;
      }
      props.slds.splice(index, 1);
      writeDbUser(
        db,
        props.userId,
        props.projId,
        'updateProjDoc',
        {
          curSldIndex: newSelected,
          lastEdited: Date.now(),
          slds: props.slds,
        },
        () => {
          props.closeOverlay('confirmDel');
          // change selection focus to the last slide of the removed slide
          props.selectSld(newSelected);
          setIsBtnDisabled(false);
        }
      );
    } else {
      alert(
        'Your presentation shall have at least one slide. 您的簡報必須有至少一張投影片。'
      );
      props.closeOverlay('confirmDel');
    }
  };
  return (
    <div className={props.confirmDelOverlayClass}>
      <Card id="confirm-del">
        <CardContent>
          <div className="overlay-card-title">
            <FormattedMessage id="edit.confirm-del-sld" />
            <CloseIcon
              className="closeX"
              onClick={() => props.closeOverlay('confirmDel')}
            />
          </div>

          <div className="confirm-del-btns">
            <Button
              value="true"
              variant="contained"
              id="del-btn"
              disabled={isBtnDisabled}
              onClick={() => {
                setIsBtnDisabled();
                deleteSld(props.delSldIndex);
              }}>
              <FormattedMessage id="edit.del-sld" />
            </Button>
            <Button
              value="false"
              variant="contained"
              id="cancel-del-btn"
              disabled={isBtnDisabled}
              onClick={() => props.closeOverlay('confirmDel')}>
              <FormattedMessage id="edit.cancel-del-sld" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
