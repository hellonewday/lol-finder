import React, { useEffect, useState } from "react";
import { checkAuthentication } from "../../auth";
import Axios from "axios";
import UserTable from "./UserTable";
const Users = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    let id = checkAuthentication();
    id
      ? Axios.get(`/users`)
          .then((response) => {
            setUsers(response.data.data);
            console.log(response.data.data);
          })
          .catch((error) => {
            console.log(error.response);
          })
      : setUsers([]);
  }, []);
  return (
    <div>
      <UserTable rows={users} />
    </div>
  );
};

export default Users;
