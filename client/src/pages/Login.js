import React, { useContext, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Link } from "react-router-dom";

import { AuthContext } from "../context/auth";
import { LOGIN_USER } from "../util/queries";

import Button from "../components/Button";
import Textfield from "../components/Textfield";

import "./Login.scss";

function Login(props) {
  const context = useContext(AuthContext);
  const [values, setValues] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, { data: { login: userData } }) {
      console.log(userData);

      context.login(userData);
      props.history.push("/");
    },
    onError(errors) {
      setErrors(errors.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  function onSubmit(e) {
    e.preventDefault();

    loginUser();
  }

  function onChange(e) {
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  return (
    <div className="login">
      {Object.keys(errors).length > 0 && (
        <ul>
          {Object.values(errors).map((error, index) => {
            return <li key={`error-${index}`}>{error}</li>;
          })}
        </ul>
      )}
      <div>
        <form onSubmit={onSubmit} noValidate>
          <Textfield
            type="text"
            name="username"
            placeholder="Username"
            value={values.username}
            onChange={onChange}
          />
          <Textfield
            type="password"
            name="password"
            placeholder="Password"
            value={values.password}
            onChange={onChange}
          />
          <Button type="submit">Login</Button>
        </form>
        <Link to="/register">Register</Link>
      </div>
    </div>
  );
}

export default Login;
