import React from "react";
import styled from "styled-components/macro";
import { useNavigate } from "react-router-dom";

import { useAppContext } from "../hooks/context/use-app-context";
import Logo from "../components/Logo";
import FormRow from "../components/FormRow";
import Alert from "../components/Alert/";

const initialAuthData = {
  name: "",
  email: "",
  password: "",
  isMember: false,
};

function Register() {
  const { displayNullAlert, showAlert, isLoading, user, setupUser } =
    useAppContext();
  const [authData, setAuthData] = React.useState(initialAuthData);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  }, [user, navigate]);

  function toggleMember() {
    setAuthData({ ...authData, isMember: !authData.isMember });
  }

  function handleChange(e) {
    setAuthData({ ...authData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const { name, email, password, isMember } = authData;

    if (!email || !password || (!isMember && !name)) {
      displayNullAlert();
      return;
    }

    const currentUser = { name, email, password };

    if (isMember) {
      setupUser({
        currentUser,
        endPoint: "login",
        alertText: "Login successful. Please wait..",
      });
    } else {
      setupUser({
        currentUser,
        endPoint: "register",
        alertText: "Register successful. Please wait..",
      });
    }
  }

  return (
    <Wrapper className="full-page">
      <form className="form" onSubmit={handleSubmit}>
        <Logo />
        <h3>{authData.isMember ? "Login" : "Register"}</h3>
        {showAlert && <Alert />}
        {!authData.isMember && (
          <FormRow
            type="text"
            name="name"
            value={authData.name}
            handleChange={handleChange}
          />
        )}
        <FormRow
          type="email"
          name="email"
          value={authData.email}
          handleChange={handleChange}
        />
        <FormRow
          type="password"
          name="password"
          value={authData.password}
          handleChange={handleChange}
        />
        <button type="submit" className="btn btn-block">
          Submit
        </button>
        <p>
          {authData.isMember ? "Not a member yet?" : "Already a member?"}{" "}
          <button
            type="button"
            className="member-btn"
            onClick={toggleMember}
            disabled={isLoading}
          >
            {authData.isMember ? "Register" : "Login"}
          </button>
        </p>
      </form>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  display: grid;
  align-items: center;
  .logo {
    display: block;
    margin: 0 auto;
    margin-bottom: 1.38rem;
  }
  .form {
    max-width: 400px;
    border-top: 5px solid var(--primary-500);
  }

  h3 {
    text-align: center;
  }
  p {
    margin: 0;
    margin-top: 1rem;
    text-align: center;
  }
  .btn {
    margin-top: 1rem;
  }
  .member-btn {
    background: transparent;
    border: transparent;
    color: var(--primary-500);
    cursor: pointer;
    letter-spacing: var(--letterSpacing);
  }
`;

export default Register;
