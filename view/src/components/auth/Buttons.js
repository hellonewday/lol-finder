import React from "react";
import axios from "axios";
// import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Typography } from "@material-ui/core";
import Login from "./Login";
import Register from "./Register";
import { checkAuthentication } from "../../auth";

const useStyles = makeStyles({
  buttons: {
    display: "flex",
  },
  login: {
    marginRight: 10,
  },
});

const Buttons = () => {
  const [username, setUsername] = React.useState(null);
  React.useEffect(() => {
    const id = checkAuthentication();
    id
      ? axios.get(`/users/${id}`).then((response) => {
          //  setUsername(response.data.data._id);
          //  console.log(response.data.data.username);
          setUsername(response.data.data.username);
        })
      : setUsername(null);
  }, []);

  const handleSetUser = () => {
    const id = checkAuthentication();
    axios.get(`/users/${id}`).then((response) => {
      //  setUsername(response.data.data._id);
      //  console.log(response.data.data.username);
      setUsername(response.data.data.username);
    });
  };

  const classes = useStyles();
  return (
    <div>
      {username ? (
        <div>
          <Typography>Welcome back, {username}</Typography>
        </div>
      ) : (
        <div className={classes.buttons}>
          <Login className={classes.login} setUser={handleSetUser} />
          <Register />
        </div>
      )}
    </div>
  );
};

export default Buttons;
