import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import bcrypt from "bcryptjs";
import axios from "axios";
import { auth, googleProvider } from "../firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./Register.module.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First name is required.";
    if (!formData.lastName) newErrors.lastName = "Last name is required.";
    if (!formData.username) newErrors.username = "Username is required.";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Valid email is required.";
    if (!formData.password || formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const profileImagePath = "assets/profile.jpg";
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(formData.password, salt);

        await axios.post("http://localhost:3000/api/users", {
          username: formData.username,
          email: formData.email,
          password_hash: hashedPassword,
          firstName: formData.firstName,
          lastName: formData.lastName,
          profileImagePath: profileImagePath,
          registrationDate: new Date().toISOString().split("T")[0],
        });

        toast.success("User registered successfully!");

        // Delay navigation to ensure the toast is visible
        setTimeout(() => {
          navigate("/login");
        }, 1500); // Adjust time as needed (e.g., 1500ms)
      } catch (error) {
        console.error(
          "Error registering user:",
          error.response?.data || error.message
        );
        toast.error("Registration failed. Please try again.");
        setErrors({
          ...errors,
          submit: "Registration failed. Please try again.",
        });
      }
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Extract user details
      const username = user.displayName || "Google User";
      const email = user.email || "";
      const firstName = user.displayName?.split(" ")[0] || "";
      const lastName = user.displayName?.split(" ").slice(1).join(" ") || "";
      const profileImagePath = user.photoURL || "assets/profile.jpg";

      // Validate fields
      if (!email || !username || !firstName || !lastName) {
        throw new Error("Missing required fields");
      }

      // Post user data to your backend
      await axios.post("http://localhost:3000/api/users", {
        username,
        email,
        password_hash: "", // Provide an empty string or adjust backend accordingly
        firstName,
        lastName,
        profileImagePath,
        registrationDate: new Date().toISOString().split("T")[0],
      });

      toast.success("User registered successfully via Google!");

      // Delay navigation to ensure the toast is visible
      setTimeout(() => {
        navigate("/login");
      }, 1500); // Adjust time as needed (e.g., 1500ms)
    } catch (error) {
      console.error(
        "Error with Google Sign-Up:",
        error.response?.data || error.message
      );
      toast.error("Google Sign-Up failed. Please try again.");
      setErrors({
        ...errors,
        submit: "Google Sign-Up failed. Please try again.",
      });
    }
  };

  return (
    <div className={styles.registerPage}>
      <div className={styles.container1}>
        <div className={styles.registerBox}>
          <div className={styles.formContainer}>
            <h2 className={styles.h2}>Register</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.inputBox}>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <label>First Name</label>
                {errors.firstName && (
                  <div className={styles.error}>{errors.firstName}</div>
                )}
              </div>
              <div className={styles.inputBox}>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
                <label>Last Name</label>
                {errors.lastName && (
                  <div className={styles.error}>{errors.lastName}</div>
                )}
              </div>
              <div className={styles.inputBox}>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
                <label>Username</label>
                {errors.username && (
                  <div className={styles.error}>{errors.username}</div>
                )}
              </div>
              <div className={styles.inputBox}>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <label>Email</label>
                {errors.email && (
                  <div className={styles.error}>{errors.email}</div>
                )}
              </div>
              <div className={styles.inputBox}>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <label>Password</label>
                {errors.password && (
                  <div className={styles.error}>{errors.password}</div>
                )}
              </div>
              <div className={styles.inputBox}>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <label>Confirm Password</label>
                {errors.confirmPassword && (
                  <div className={styles.error}>{errors.confirmPassword}</div>
                )}
              </div>
              <button type="submit" className={styles.btn}>
                Register
              </button>
              {errors.submit && (
                <div className={styles.error}>{errors.submit}</div>
              )}
              <div className={styles.googleSignUp} onClick={handleGoogleSignUp}>
                <FontAwesomeIcon
                  icon={faGoogle}
                  className={styles.googleIcon}
                />
                <span>Sign up with Google</span>
              </div>
              <div className={styles.signupLink}>
                <p>
                  Already have an account?{" "}
                  <Link to="/login" className={styles.registerLink}>
                    Login
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
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
