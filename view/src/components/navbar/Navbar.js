import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Buttons from "../auth/Buttons";

const useStyles = makeStyles({
  root: {
    width: "100%",
    margin: 0,
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
  },
});

export default function Navbar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static" style={{ backgroundColor: "teal" }}>
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" color="inherit">
            LOL Team Finder Development Tool
          </Typography>
          <Buttons />
        </Toolbar>
      </AppBar>
    </div>
  );
}
