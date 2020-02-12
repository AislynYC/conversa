import React, {Fragment} from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {makeStyles} from "@material-ui/core/styles";
import Header from "../components/Header/Header";
import "./style.css";

const LogIn = props => {
  const useStyles = makeStyles({
    root: {
      minWidth: 275,
      width: "40%"
    }
  });
  const classes = useStyles();
  return (
    <Fragment>
      <Header {...props} locale={props.locale} setLocale={props.setLocale} />
      <div className="entry-page">
        <div className="entry-card">
          <Card className={classes.root}>
            <CardContent>Test</CardContent>
          </Card>
        </div>
      </div>
    </Fragment>
  );
};
export default LogIn;
