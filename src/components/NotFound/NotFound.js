import React from "react";
import {Link} from "react-router-dom";
import Button from "@material-ui/core/Button";
import NotFoundImg from "../../img/404.png";
import "./notFound.css";

const NotFound = () => {
  return (
    <div className="not-found-wrap">
      <h1>Oops</h1>
      <div className="not-found-img">
        <img src={NotFoundImg} />
      </div>

      <h2>404 Not Found</h2>
      <Button variant="contained">
        <Link to="/">
          <div>Back to Home</div>
        </Link>
      </Button>
    </div>
  );
};

export default NotFound;
