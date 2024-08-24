import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let navigate = useNavigate();
  // console.log("email", email);
  // console.log("password", password);

  const SubmitForm = async (e) => {
    e.preventDefault();
    console.log("email", email);
    console.log("password", password);
    await axios.post(
      "http://localhost:8055/auth/login",
      {
        email: email,
        password: password,
        mode: "session",
      },
      {
        withCredentials: true,
      }
    );
    navigate("/");
  };

  return (
    <div>
      Login
      <br />
      <br />
      <form onSubmit={SubmitForm}>
        email:{" "}
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        password:{" "}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default Login;
