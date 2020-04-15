import axios from "axios";

export function checkAuthentication() {
  const token = window.localStorage.getItem("auth_token");
  if (token || token !== "") {
    return window.localStorage.getItem("auth_id");
  } else {
    return false;
  }
}
export function getUserDataFromID() {
  const id = window.localStorage.getItem("auth_id");
  if (id || id !== "") {
    axios.get(`/users/${id}`).then((response) => {
      return response.data.data;
    });
  } else {
    return false;
  }
}
