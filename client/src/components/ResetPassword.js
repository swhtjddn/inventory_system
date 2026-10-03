import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

const ResetPassword = (props) => {
  let history = useHistory();
  const [success, setSuccess] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const validateForm = () => {
    return email.length > 0;
  };

  const handleReset = (e) => {
    e.preventDefault();

    const userData = {
      email,
    };

    axios
      .post("/api/resetpassword", userData)
      .then((res) => {
        if (res.request.status === 200) {
          setSuccess(
            "A password reset email has been sent to your email if it exists"
          );
        }
      })
      .catch((err) => {
        setError(err.response.data.message);
      });
  };

  return (
    <section className="login-page">
      <h1>What is your email?</h1>
      <form onSubmit={handleReset} className="login-form" method="POST">
        <input
          type="email"
          name="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {success ? <p>{success}</p> : null}
        {error ? <p className="login-error">{error}</p> : null}
        <button type="submit" disabled={!validateForm()}>
          Send Reset Link
        </button>
      </form>
    </section>
  );
};

export default ResetPassword;
