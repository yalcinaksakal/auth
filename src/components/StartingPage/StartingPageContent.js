import { useContext } from "react";
import AuthContext from "../../store/auth-context";
import classes from "./StartingPageContent.module.css";

const StartingPageContent = () => {
  const { isLoggedIn } = useContext(AuthContext);
  return (
    <section className={classes.starting}>
      <h1>{isLoggedIn ? "Welcome on Board!" : "Please Login"}</h1>
    </section>
  );
};

export default StartingPageContent;
