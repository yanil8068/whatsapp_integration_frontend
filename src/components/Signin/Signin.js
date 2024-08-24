import React, { useState } from "react";

const Signin = () => {
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  // console.log("email", email);
  // console.log("password", password);

  let SubmitForm = (e) => {
    e.preventDefault();
    console.log("email", email);
    console.log("password", password);
    console.log("email", email);
  };

  return (
    <div>
      Signin
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
        <button type="submit">signin</button>
      </form>
    </div>
  );
};

export default Signin;
