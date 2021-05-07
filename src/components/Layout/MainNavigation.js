import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import AuthContext from "../../store/auth-context";

import classes from "./MainNavigation.module.css";

const MainNavigation = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);

  const logoutHanler = () => {
    logout();
  };
  return (
    <header className={classes.header}>
      <Link to="/">
        <div className={classes.logo}>React Auth</div>
      </Link>
      <nav>
        <ul>
          {!isLoggedIn && (
            <li>
              <Link to="/auth">Login</Link>
            </li>
          )}
          {isLoggedIn && (
            <>
              <li>
                <NavLink activeClassName={classes.active} to="/profile">
                  Profile
                </NavLink>
              </li>

              <li>
                <button onClick={logoutHanler}>Logout</button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
