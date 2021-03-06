import React from "react";
import { useState } from "react";
import { db, auth, google } from "./firebase";
import { v4 as uuidv4 } from "uuid";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import Search from "./Search";
import Modal from "react-modal";
import { modalStyles } from "./GlobalStyle";

export const StyledSignup = styled.form`
  margin: 0 auto;
  width: 85%;
  max-width: 1400px;
  display: block;
  padding: 5px;
`;

export const StyledInput = styled.input`
  width: 75%;
  border-radius: 5px;
  font-size: 16px;
  padding: 5px;
  margin: 5px;
`;

export const StyledP = styled.p`
  font-size: 12px;
  margin: 10px;
`;

export const StyledGoogleButton = styled.button`
  height: 2.5em;
  border-radius: 5px;
  background-color: #d84b37;
  font-size: 18px;
  margin: 10px;
`;

export const StyledButton = styled.button`
  height: 2em;
  border-radius: 5px;
  font-size: 16px;
  border-radius: 5px;
  margin: 20px;
  background-color: #00adb5;
`;

export const StyledCard = styled.div`
  margin: 0 auto;
  width: 85%;
  max-width: 1400px;
  display: block;
  padding: 5px;
  text-align: center;
`;

function Signup({
  username,
  setUsername,
  isLoggedIn,
  setIsLoggedIn,
  theme,
  user_UID,
}) {
  modalStyles.content.background = theme.background;

  const [modal, setModal] = useState(false);

  const [resetPassInupt, setResetPassInput] = useState("");

  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [formKey, setFormKey] = useState(uuidv4());

  function handleChange(e) {
    const { name, value } = e.target;
    setInput(prev => {
      return {
        ...prev,
        [name]: value,
      };
    });
  }

  function createAccount(e) {
    e.preventDefault();
    const username = input.username;
    const email = input.email;
    const password = input.password;
    const confirmPassword = input.confirmPassword;

    let reg = /^.{6,25}$/g;

    if (!reg.test(password)) {
      alert("password must be between 6 and 25 characters long");
      return;
    }

    if (password !== confirmPassword) {
      alert("passwords do not match");
      return;
    }

    setUsername(username);

    auth
      .createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        return db.collection("users").doc(userCredential.user.uid).set({
          username: username,
          email: email,
          uid: userCredential.user.uid,
        });
      })
      .catch(error => {
        alert(
          `Error. Could not create account. Please Try again. ${error.code}`
        );
      });
  }

  function createAccountWithGoogle() {
    setUsername(username);
    auth
      .signInWithPopup(google)
      .then(() => {
        setIsLoggedIn(true);
      })
      .catch(error => {
        var errorCode = error.code;
        var errorMessage = error.message;
        setIsLoggedIn(null);
        alert(`Could not signup: ${errorCode}. ${errorMessage}`);
      });
  }

  function renderModal() {
    return (
      <Modal
        theme={theme}
        isOpen={modal}
        onRequestClose={() => setModal(false)}
        style={modalStyles}
      >
        <StyledSignup onSubmit={resetPassword}>
          <h3>Password Reset</h3>
          <p>An email with reset instructions will be sent to:</p>
          <input
            style={{ margin: 20 }}
            onChange={handlePassInput}
            placeholder="yourname@email.com"
            type="email"
            name="email"
            required
          ></input>
          <br></br>
          <button type="submit" style={{ margin: 5 }}>
            send email
          </button>
          <button onClick={() => setModal(false)} style={{ margin: 5 }}>
            cancel
          </button>
        </StyledSignup>
      </Modal>
    );
  }

  function handlePassInput(e) {
    setResetPassInput(e.currentTarget.value);
  }

  function resetPassword(e) {
    e.preventDefault();
    const resetEmail = resetPassInupt;
    auth
      .sendPasswordResetEmail(resetEmail)
      .then(function () {
        alert("check your email for reset instructions");
        setModal(false);
      })
      .catch(function (error) {
        alert(error + "could not send reset password email");
        console.error(error + "could not send reset password email");
      });
  }

  return (
    <>
      <div>
        {isLoggedIn ? (
          <>
            <Search
              theme={theme}
              username={username}
              isLoggedIn={isLoggedIn}
              user_UID={user_UID}
            />
          </>
        ) : (
          <>
            <h3>Create Your Account</h3>
            <StyledCard>
              <StyledGoogleButton
                name="googleSignIn"
                onClick={createAccountWithGoogle}
              >
                {<FcGoogle size={25} />} Sign up with Google
              </StyledGoogleButton>
            </StyledCard>
            <StyledSignup key={formKey} onSubmit={createAccount}>
              <h4>Register</h4>
              <StyledInput
                required
                maxLength="75"
                name="username"
                placeholder="pick a username"
                onChange={handleChange}
              ></StyledInput>
              <br></br>
              <StyledInput
                type="email"
                required
                minLength="6"
                maxLength="75"
                name="email"
                placeholder="your email"
                onChange={handleChange}
              ></StyledInput>
              <br></br>
              <br></br>
              <StyledInput
                required
                placeholder="create a password"
                name="password"
                type="password"
                onChange={handleChange}
              ></StyledInput>
              <StyledInput
                required
                placeholder="confirm your password"
                name="confirmPassword"
                type="password"
                onChange={handleChange}
              ></StyledInput>
              <StyledP>Password must be at least 6 characters long</StyledP>
              <StyledButton type="submit">create my account</StyledButton>
              <hr></hr>
              <div>
                <p>
                  Already have an account?
                  <br></br>
                  <StyledButton>
                    <Link to="/signin">sign in</Link>
                  </StyledButton>
                </p>
              </div>
            </StyledSignup>
            <StyledCard>
              <p>
                Forgot Your Password?
                <br></br>
                <StyledButton onClick={() => setModal(true)}>
                  reset password
                </StyledButton>
              </p>
            </StyledCard>
          </>
        )}
      </div>
      <div>{renderModal()}</div>
    </>
  );
}

export default Signup;
