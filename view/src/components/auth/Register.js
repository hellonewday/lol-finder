import React from "react";
import axios from "axios";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

export default function Register() {
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState({});

  //   React.useEffect(() => {
  //     axios.get("/players").then((response) => {
  //       console.log(response);
  //     });
  //   }, []);
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
      .post("/users/register", input)
      .then((response) => {
        console.log(response);
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
    <div>
      <Button variant="contained" color="secondary" onClick={handleClickOpen}>
        Register
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Register an account</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            onChange={handleChange}
          />
          <TextField
            autoFocus
            margin="dense"
            name="username"
            label="Choose your coolest username"
            type="text"
            fullWidth
            onChange={handleChange}
          />
          <TextField
            autoFocus
            margin="dense"
            name="password"
            label="Password"
            type="password"
            fullWidth
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Register
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
