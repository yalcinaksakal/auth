import { useContext, useRef, useState } from "react";
import { useHistory } from "react-router";
import AuthContext from "../../store/auth-context";

import classes from "./AuthForm.module.css";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isErr, setIsErr] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const emailRef = useRef();
  const pwdRef = useRef();
  const authCtx = useContext(AuthContext);
  const history = useHistory();
  const showPwdHandler = () => {
    setShowPwd(prevState => !prevState);
  };

  const switchAuthModeHandler = () => {
    setIsLogin(prevState => !prevState);
    setIsErr(null);
    emailRef.current.value = "";
    pwdRef.current.value = "";
    setShowPwd(false);
  };

  const submitHandler = event => {
    event.preventDefault();
    const enteredEmail = emailRef.current.value;
    const enteredPwd = pwdRef.current.value;

    setIsLoading(true);
    setIsErr(null);
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:${
      isLogin ? "signInWithPassword" : "signUp"
    }?key=AIzaSyDEnXFbshker5Olr0956buPRDcbGY7HxjU`;

    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPwd,
        returnSecureToken: true,
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then(res => {
        setIsLoading(false);
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then(data => {
            let errorMsg = "Failed";
            if (!isLogin && data && data.error && data.error.message)
              errorMsg = data.error.message.replaceAll("_", " ").toLowerCase();
            throw new Error(errorMsg);
          });
        }
      })
      .then(data => {
        authCtx.login(data.idToken);
        history.replace("/");
      })
      .catch(error => {
        setIsErr(error.message);
      });
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input
            type="email"
            id="email"
            required
            ref={emailRef}
            className={classes.email}
          />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <div className={classes.pwd}>
            <input
              type={showPwd ? "text" : "password"}
              id="password"
              required
              ref={pwdRef}
              className={classes.pwdInput}
            />
            <i
              onClick={showPwdHandler}
              className={`far fa-eye${showPwd ? "" : "-slash"}`}
            ></i>
          </div>
        </div>
        <div className={classes.actions}>
          {isLoading ? (
            <p>Sending Request...</p>
          ) : (
            <button>{isLogin ? "Login" : "Create Account"}</button>
          )}
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
          {isErr ? <p className={classes.error}>{isErr}</p> : ""}
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
