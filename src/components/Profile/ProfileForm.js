import { useContext, useRef, useState } from "react";
import { useHistory } from "react-router";
import AuthContext from "../../store/auth-context";
import classes from "./ProfileForm.module.css";

const ProfileForm = () => {
  const newPwdRef = useRef();
  const [showPwd, setShowPwd] = useState(false);
  const { token } = useContext(AuthContext);
  const history = useHistory();
  const showPwdHandler = () => {
    setShowPwd(prevState => !prevState);
  };
  const submitHandler = e => {
    e.preventDefault();
    const enteredPwd = newPwdRef.current.value;

    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDEnXFbshker5Olr0956buPRDcbGY7HxjU",
      {
        method: "POST",
        body: JSON.stringify({
          idToken: token,
          password: enteredPwd,
          returnSecureToken: false,
        }),
        headers: { "Content-Type": "application/json" },
      }
    ).then(res => {
      // assume success
      history.replace("/");
    });
  };
  return (
    <form onSubmit={submitHandler} className={classes.form}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <div>
          <input
            type={`${showPwd ? "text" : "password"}`}
            // wont validate pwd, just use minlength now
            minLength="7"
            id="new-password"
            ref={newPwdRef}
          />
          <i
            onClick={showPwdHandler}
            className={`far fa-eye${showPwd ? "" : "-slash"}`}
          ></i>
        </div>
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
