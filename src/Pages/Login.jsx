import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebaseConfig";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import styles from "./Login.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleTraditionalLogin = async (e) => {
    e.preventDefault();
    try {
      // Send login request to backend
      const response = await axios.post("http://localhost:3000/api/login", {
        email,
        password,
      });

      const userData = response.data.user;

      // Navigate based on user data
      if (userData.email === "admin@gmail.com") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (error) {
      console.error(
        "Login error:",
        error.response?.data?.error || error.message
      );
      toast.error("Invalid email or password.");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Navigate to home after Google sign-in
      navigate("/home");

      toast.success("Logged in with Google successfully!");
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error("Google sign-in failed. Please try again.");
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.container1}>
        <div className={styles.loginBox}>
          <h2 className={styles.h2}>Login</h2>
          <form onSubmit={handleTraditionalLogin}>
            <div className={styles.inputBox}>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                required
              />
              <label>Email</label>
            </div>
            <div className={styles.inputBox}>
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
              <label>Password</label>
            </div>
            <div className={styles.forgotPass}>
              <a href="#">Forgot your password?</a>
            </div>
            <button type="submit" className={styles.btn}>
              Login
            </button>
            <div className={styles.googleSignUp} onClick={handleGoogleSignIn}>
              <FontAwesomeIcon icon={faGoogle} className={styles.googleIcon} />
              <span>Sign in with Google</span>
            </div>
            <div className={styles.signupLink}>
              <p>
                Don't have an account?{" "}
                <Link to="/register" className={styles.registerLink}>
                  Register
                </Link>
              </p>
            </div>
          </form>
        </div>
        {[...Array(50)].map((_, index) => (
          <span
            key={index}
            style={{ "--i": index }}
            className={styles.animateSpan}
          ></span>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
