import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";

import { REGISTER_USER } from "../util/queries";

function Register(props) {
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, result) {
      props.history.push("/");
    },
    onError(errors) {
      setErrors(errors.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  function onSubmit(e) {
    e.preventDefault();

    addUser();
  }

  function onChange(e) {
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  if (loading) {
    return <div>Loading</div>;
  }
  return (
    <div>
      <h2>Register</h2>
      {Object.keys(errors).length > 0 && (
        <ul>
          {Object.values(errors).map((error, index) => {
            return <li key={`error-${index}`}>{error}</li>;
          })}
        </ul>
      )}
      <div>
        <form onSubmit={onSubmit} noValidate>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={values.username}
            onChange={onChange}
          />
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={values.email}
            onChange={onChange}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={values.password}
            onChange={onChange}
          />
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={values.confirmPassword}
            onChange={onChange}
          />
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
