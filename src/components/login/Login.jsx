import React, { useState } from "react";
import { loginAdmin } from "../../api/api";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import art from "../../assets/Art.png";
import { LuEye } from "react-icons/lu";
import { FiEyeOff } from "react-icons/fi";
import { MdOutlineMailOutline } from "react-icons/md";
import { CiLock } from "react-icons/ci";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    let errors = {};
    let formIsValid = true;

    if (!formData.email.trim()) {
      errors.email = "Email is required";
      formIsValid = false;
    }

    if (!formData.password) {
      errors.password = "Password is required";
      formIsValid = false;
    }

    setFormErrors(errors);
    return formIsValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      const result = await loginAdmin(formData).catch((error) => {
        toast.error(error.message);
        setLoading(false);
      });
      if (result?.status === 200) {
        toast.success("Logged in successfully");
        setTimeout(() => {
          setLoading(false);
          navigate("/board");
        }, 1500);
      }
      else{
        setLoading(false);
      }
    } 
    else {
      console.log("Form has errors. Cannot submit.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
      <div className={styles.form}>
        <div className={styles.formContainer}>
          <h4 className={styles.heading}>Login</h4>
          <form>
            <div className={styles.email}>
              <div className={styles.inputbox}>
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
            {formErrors.email && <p className={styles.error}>{formErrors.email}</p>}
            <div className={styles.passwordContainer}>
              <div className={styles.inputbox}>
                <label className={styles.label}>
                  <CiLock className={styles.icon} />
                </label>
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
            {formErrors.password && (
              <p className={styles.error}>{formErrors.password}</p>
            )}
            <button
              type="submit"
              className={styles.loginButton}
              onClick={(e) => handleSubmit(e)}
              disabled={loading} 
            >
              {loading ? (
                <div className={styles.loader}></div>
              ) : (
                "Log in"
              )}
            </button>
          </form>
          <p className={styles.ask}>Have no account yet?</p>
          <button
            type="submit"
            className={styles.registerButton}
            onClick={() => navigate("/signUp")}
          >
            Register
          </button>
        </div>
      </div>
      <ToastContainer autoClose={1000} />
    </div>
  );
}

export default Login;
