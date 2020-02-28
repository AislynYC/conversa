import React, {Fragment} from "react";
import {connect} from "react-redux";
import {FormattedMessage} from "react-intl";
import {Link} from "react-router-dom";

import Header from "./components/Header/Header";
import firebase from "./config/fbConfig";
import MainImg from "./img/main_img.svg";
import logoLeaf from "./img/logo.png";
import Button from "@material-ui/core/Button";
import step1Img from "./img/ask.png";
import step2Img from "./img/response.png";
import step3Img from "./img/visual-data.png";
import "./home.css";
import Loading from "./components/Loading/Loading";

// FontAwesome Setting
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {library} from "@fortawesome/fontawesome-svg-core";
import {faComments, faChartBar} from "@fortawesome/free-regular-svg-icons";
import {faHeart, faFileAlt} from "@fortawesome/free-solid-svg-icons";
library.add(faComments, faHeart, faChartBar, faFileAlt);

const Home = props => {
  let path = "/signUp";
  console.log("Auth", props.auth);
  if (props.auth.isLoaded === false) {
    <Loading />;
  } else if (props.auth.isLoaded === true && props.auth.isEmpty === true) {
    console.log("No user", props.auth);
    path = "/signUp";
  } else {
    if (firebase.auth().currentUser === null) {
      // After user signed out and redirect to this page, auth.isLoaded & auth.isEmpty are still remain sign in status for a while
      // so currentUser need to be confirmed first before loading this page
      console.log("user is signed out", props.auth);
    } else {
      path = `/pm/${props.auth.uid}`;
      // User is signed in.
      var displayName = props.auth.displayName;
      var email = props.auth.email;
      var emailVerified = props.auth.emailVerified;
      var photoURL = props.auth.photoURL;
      var uid = props.auth.uid;
      var phoneNumber = props.auth.phoneNumber;
      var providerData = props.auth.providerData;
      firebase
        .auth()
        .currentUser.getIdToken()
        .then(function(accessToken) {
          console.log("Signed in");

          let userData = JSON.stringify(
            {
              displayName: displayName,
              email: email,
              emailVerified: emailVerified,
              phoneNumber: phoneNumber,
              photoURL: photoURL,
              uid: uid,
              accessToken: accessToken,
              providerData: providerData
            },
            null,
            "  "
          );
          console.log(userData);
        });
    }
  }

  return (
    <Fragment>
      <Header {...props} locale={props.locale} setLocale={props.setLocale} />
      <div className="sec sec1">
        <div className="circle1"></div>
        <div className="circle2"></div>
        <div className="sec1-desc">
          <div className="desc-text">
            <FormattedMessage id="home.main-title" />
          </div>
          <Link to={path}>
            <Button variant="contained" id="get-started-btn">
              <div className="logo-leaf">
                <img src={logoLeaf} alt="logo-leaf" />
              </div>
              <FormattedMessage id="home.get-started" />
            </Button>
          </Link>
        </div>
        <div className="main-img">
          <MainImg viewBox="0 0 800 800" id="main-img-svg" />
        </div>
      </div>
      <div className="sec sec2">
        <div className="boxes">
          <div className="box">
            <div className="box-circle"></div>
            <FontAwesomeIcon className="sec2-icon" icon={["fas", "file-alt"]} />
            <div className="sec2-box-title">
              <FormattedMessage id="home.sec2-box1-title" />
            </div>
            <div className="sec2-box-text">
              <FormattedMessage id="home.sec2-box1-detail" />
            </div>
          </div>
          <div className="box">
            <div className="box-circle"></div>
            <FontAwesomeIcon className="sec2-icon" icon={["far", "comments"]} />
            <div className="sec2-box-title">
              <FormattedMessage id="home.sec2-box2-title" />
            </div>
            <div className="sec2-box-text">
              <FormattedMessage id="home.sec2-box2-detail" />
            </div>
          </div>
          <div className="box">
            <div className="box-circle"></div>
            <FontAwesomeIcon className="sec2-icon" icon={["fas", "heart"]} />
            <div className="sec2-box-title">
              <FormattedMessage id="home.sec2-box3-title" />
            </div>
            <div className="sec2-box-text">
              <FormattedMessage id="home.sec2-box3-detail" />
            </div>
          </div>
          <div className="box">
            <div className="box-circle"></div>
            <FontAwesomeIcon className="sec2-icon" icon={["far", "chart-bar"]} />
            <div className="sec2-box-title">
              <FormattedMessage id="home.sec2-box4-title" />
            </div>
            <div className="sec2-box-text">
              <FormattedMessage id="home.sec2-box4-detail" />
            </div>
          </div>
        </div>
      </div>
      <div className="sec sec3">
        <div className="sec3-title">
          {" "}
          <FormattedMessage id="home.how-it-work" />
        </div>
        <div className="steps step1">
          <div className="step-left">
            <div className="step1-img step-img">
              <img src={step1Img} alt="step1-img" />
            </div>
          </div>
          <div className="step-right">
            <div className="step-desc">
              <div className="step-num num01">01</div>
              <div className="step-title">
                <FormattedMessage id="home.step1-title" />
              </div>
              <div>
                <FormattedMessage id="home.step1-detail" />
              </div>
            </div>
          </div>
        </div>
        <div className="steps step2">
          <div className="step-left">
            <div className="step-desc">
              <div className="step-num num02">02</div>
              <div className="step-title">
                <FormattedMessage id="home.step2-title" />
              </div>
              <div>
                <FormattedMessage id="home.step2-detail" />
              </div>
            </div>
          </div>
          <div className="step-right">
            <div className="step2-img step-img">
              <img src={step2Img} alt="step2-img" />
            </div>
          </div>
        </div>
        <div className="steps step3">
          <div className="step-left">
            <div className="step3-img step-img">
              <img src={step3Img} alt="step3-img" />
            </div>
          </div>
          <div className="step-right">
            <div className="step-desc">
              <div className="step-num num03">03</div>
              <div className="step-title">
                <FormattedMessage id="home.step3-title" />
              </div>
              <div>
                <FormattedMessage id="home.step3-detail" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer">
        <div>© 2020 Conversa powered by Aislyn Y.C.</div>
        <div>Icon credit to fontawesome.com. Illustration credit to undraw.co.</div>
        <div>Contact me via chuang.yuchun@gmail.com</div>
      </div>
    </Fragment>
  );
};

let mapStateToProps = (state, props) => {
  return {
    firestore: state.firestore,
    auth: state.firebase.auth
  };
};

export default connect(mapStateToProps)(Home);
