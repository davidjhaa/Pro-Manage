import React, { useState } from "react";
import { registerAdmin } from "../../api/api";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./SignUp.module.css";
import art from "../../assets/Art.png";
import { CiUser } from "react-icons/ci";
import { LuEye } from "react-icons/lu";
import { FiEyeOff } from "react-icons/fi";
import { MdOutlineMailOutline } from "react-icons/md";
import { CiLock } from "react-icons/ci";

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    let errors = {};
    let formIsValid = true;

    if (!formData.name.trim()) {
      errors.name = "Name is required";
      formIsValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
      formIsValid = false;
    }

    if (!formData.password) {
      errors.password = "Password is required";
      formIsValid = false;
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Confirm Password is required";
      formIsValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      formIsValid = false;
    }

    setFormErrors(errors);
    return formIsValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const result = await registerAdmin(formData).catch((error) => {
        notify(error.message);
      });
      console.log("Form submitted successfully:", formData);
      if (result.status === 200) {
        console.log(result);
        toast.success("signed up successfull");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
      if (result.status === 409) {
        console.log(result);
        toast.error("Account with this mail already exist");
        return;
      }
    } else {
      console.log("Form has errors. Cannot submit.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className={styles.container}>
      <div className={styles.cover}>
        <div className={styles.banner}>
          <div className={styles.round}></div>
          <img src={art} alt="Art" className={styles.photo} />
        </div>
        <div className={styles.welcome}>
          <p>Welcome aboard my friend</p>
          <span>Just a couple of clicks and we start</span>
        </div>
      </div>
      <div className={styles.registerForm}>
        <div className={styles.formContainer}>
          <h4 className={styles.heading}>Register</h4>
          <form className={styles.form}>
            <div className={styles.inputBox}>
              <div className={styles.inputWithIcon}>
                <CiUser className={styles.icon} />
                <input
                  className={styles.input}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  type="text"
                  placeholder="Name"
                />
              </div>
              
            </div>
            {formErrors.name && (<p className={styles.error}>{formErrors.name}</p>)}
            <div className={styles.inputBox}>
              <div className={styles.inputWithIcon}>
                <MdOutlineMailOutline className={styles.icon} />
                <input
                  className={styles.input}
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="Email"
                />
              </div>
              
            </div>
            {formErrors.email && ( <p className={styles.error}>{formErrors.email}</p> )}
            <div className={styles.inputBox}>
              <div className={styles.inputWithIcon}>
                <CiLock className={styles.icon} />
                <input
                  className={styles.passwordInput}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                />
                <button
                  type="button"
                  className={styles.toggleButton}
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <LuEye /> : <FiEyeOff />}
                </button>
              </div>
            </div>
            {formErrors.password && (<p className={styles.error}>{formErrors.password}</p>  )}
            <div className={styles.inputBox}>
              <div className={styles.inputWithIcon}>
                <CiLock className={styles.icon} />
                <input
                  className={styles.passwordInput}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm password"
                />
                <button
                  type="button"
                  className={styles.toggleButton}
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? <LuEye /> : <FiEyeOff />}
                </button>
              </div>
            </div>
            {formErrors.confirmPassword && (  <p className={styles.error}>{formErrors.confirmPassword}</p>)}
            <button
              type="submit"
              className={styles.submitButton}
              onClick={(e) => handleSubmit(e)}
            >
              Register
            </button>
          </form>
          <p>Have an account?</p>
          <button
            className={styles.loginButton}
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </div>
      <ToastContainer autoClose={1000} />
    </div>
  );
}

export default SignUp;
