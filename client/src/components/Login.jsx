import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";

// We pass setAuth from App.js (Parent) to here (Child)
const Login = ({ setAuth }) => {

  const [inputs, setInputs] = useState({
    email: "",
    password: ""
  });

  const { email, password } = inputs;

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  // 👇 NEW FUNCTION: Handle the submit
  const onSubmitForm = async (e) => {
    e.preventDefault(); // 1. Stop the refresh

    try {
      // 2. Prepare the body (email, password)
      const body = { email, password };

      // 3. Send the Request
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      // 4. Get the Parse Response (The Token!)
      const parseRes = await response.json();

      // 5. If we got a token, save it!
      if (parseRes.token) {
        localStorage.setItem("token", parseRes.token); // Save to browser
        setAuth(true); // Tell App.js "We are logged in!"
        console.log("Login Success!");
      } else {
        setAuth(false);
        console.log(parseRes); // Log the error (e.g., "Incorrect Password")
      }

    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>
      <h1 className="text-center my-5">Login</h1>
      <form onSubmit={onSubmitForm}>
        <input
          type="email"
          name="email"
          placeholder="email"
          className="form-control my-3"
          value={email}
          onChange={(e) => onChange(e)}
        />
        <input
          type="password"
          name="password"
          placeholder="password"
          className="form-control my-3"
          value={password}
          onChange={(e) => onChange(e)}
        />
        <button className="btn btn-success btn-block">Submit</button>
      </form>
      <Link to="/register">Register</Link>
    </Fragment>
  );
};

export default Login;