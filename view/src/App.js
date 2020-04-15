import React from "react";
import "./App.css";
import Navbar from "./components/navbar/Navbar";
import { checkAuthentication } from "./auth";
import Users from "./components/users/Users";

function App() {
  return (
    <div>
      <Navbar />
      <h1 style={{ textAlign: "center" }}>
        {checkAuthentication() ? (
          <div>
            Hello, {checkAuthentication()}
            <Users />
          </div>
        ) : (
          <div>You have to log in to do this request</div>
        )}
      </h1>
    </div>
  );
}

export default App;
