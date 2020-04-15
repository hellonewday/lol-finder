import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import axios from "axios";
// import { checkAuthentication } from "../../auth";

export default function Login({ className, setUser }) {
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState({});

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(input);
    axios
      .post("/users/login", input)
      .then((response) => {
        //    console.log(response.data.token);
        window.localStorage.setItem("auth_token", response.data.token);
        window.localStorage.setItem("auth_id", response.data.id);
        //    console.log(window.localStorage.getItem("token"));
        //    console.log(checkAuthentication());
        setUser();
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  const handleChange = (event) => {
    event.persist();
    //     console.log(event.target.name);
    //     console.log(event.target.value);
    setInput((prevInput) => ({
      ...prevInput,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <div className={className}>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Login
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          Login with your account
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            name="email"
            fullWidth
            onChange={handleChange}
          />
          <TextField
            autoFocus
            margin="dense"
            id="password"
            name="password"
            label="Password"
            type="password"
            onChange={handleChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Login
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
