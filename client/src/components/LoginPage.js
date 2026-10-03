import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

const LoginPage = (props) => {
  let history = useHistory();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validateForm = () => {
    return username.length > 0 && password.length > 0;
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const userData = {
      username,
      password,
    };

    axios
      .post("/api/login", userData)
      .then((res) => {
        if (res.request.status === 200) {
          history.go(0);
        }
      })
      .catch((err) => {
        setError(err.response.data.message);
      });
  };

  return (
    <section className="login-page">
      <h1>Lash Dreams Login Portal</h1>
      <form onSubmit={handleLogin} className="login-form" method="POST">
        <input
          type="text"
          name="username"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          name="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error ? <p className="login-error">{error}. Try again.</p> : null}
        <button className="login-btn" type="submit" disabled={!validateForm()}>
          Login
        </button>
        <p>Forgot Password?</p>
      </form>
    </section>
  );
};

export default LoginPage;
