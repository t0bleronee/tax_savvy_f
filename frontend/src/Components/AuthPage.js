import React, { useState } from "react";
import axios from "axios";
import "../css/login.css";

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password, confirmPassword } = form;

    // Basic validations
    if (!email || !password || (!isLogin && !name)) {
      alert("Please fill in all required fields.");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const response = await axios.post("http://localhost:3001/api/login", {
          email,
          password
        });

        if (response.data.success) {
          alert("Login successful!");
          // Add localStorage/token saving logic here if needed
          localStorage.setItem("userEmail", email);
        } else {
          alert(response.data.message || "Login failed!");
        }

      } else {
        const response = await axios.post("http://localhost:3001/api/signup", {
          name,
          email,
          password
        });

        if (response.data.success) {
          alert("Signup successful! Please login.");
          setIsLogin(true);
          setForm({ name: "", email: "", password: "", confirmPassword: "" });
        } else {
          alert(response.data.message || "Signup failed!");
        }
      }

    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex vh-100 justify-content-center align-items-center" style={{ backgroundColor: "#2EA77D" }}>
      <div className="p-2 flex-grow">
        <div className="smallContainer border shadow rounded">
          <div className="row g-0">
            {/* Left Buttons */}
            <div className="col-sm-6 col-xs-12 d-none d-sm-block position-relative" id="leftCol" style={{ backgroundColor: "#D1E0E0" }}>
              <div className="position-absolute end-0 top-50 translate-middle-y d-flex flex-column text-end w-100 px-3">
                <button
                  className={`customBtn ${isLogin ? "activeBtn" : "whiteBtn"}`}
                  onClick={() => setIsLogin(true)}
                >
                  Login
                </button>
                <button
                  className={`customBtn ${!isLogin ? "activeBtn" : "whiteBtn"}`}
                  onClick={() => setIsLogin(false)}
                >
                  Signup
                </button>
              </div>
            </div>

            {/* Right Form Section */}
            <div className="col-sm-6 col-xs-12">
              <div className="d-flex flex-column h-100 justify-content-center">
                <div className="p-5 text-center">
                  <img src="/Assets/logo.png" height="72" alt="Logo" className="mb-3" />
                  <h2 className="h3 pb-3">{isLogin ? "LOGIN" : "SIGNUP"}</h2>

                  <form onSubmit={handleSubmit}>
                    {/* Name Field (Signup Only) */}
                    {!isLogin && (
                      <div className="position-relative my-3 inputGroup">
                        <span className="position-absolute"><i className="far fa-user"></i></span>
                        <input
                          type="text"
                          name="name"
                          className="border-0 border-bottom w-100"
                          placeholder="Enter Name"
                          value={form.name}
                          onChange={handleChange}
                        />
                      </div>
                    )}

                    {/* Email Field */}
                    <div className="position-relative my-3 inputGroup">
                      <span className="position-absolute"><i className="far fa-envelope"></i></span>
                      <input
                        type="email"
                        name="email"
                        className="border-0 border-bottom w-100"
                        placeholder="Enter Email"
                        value={form.email}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Password Field */}
                    <div className="position-relative my-3 inputGroup">
                      <span className="position-absolute"><i className="far fa-eye-slash"></i></span>
                      <input
                        type="password"
                        name="password"
                        className="border-0 border-bottom w-100"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Confirm Password Field (Signup Only) */}
                    {!isLogin && (
                      <div className="position-relative my-3 inputGroup">
                        <span className="position-absolute"><i className="far fa-eye-slash"></i></span>
                        <input
                          type="password"
                          name="confirmPassword"
                          className="border-0 border-bottom w-100"
                          placeholder="Confirm Password"
                          value={form.confirmPassword}
                          onChange={handleChange}
                        />
                      </div>
                    )}

                    <div className="d-flex align-items-center justify-content-between pt-2">
                      {isLogin && (
                        <a className="linkFlare" href="#"><small>Forgot Password?</small></a>
                      )}
                      <button
                        type="submit"
                        className="btn btn-success px-4 rounded-pill ms-auto"
                        disabled={loading}
                      >
                        {loading ? "Please wait..." : "SUBMIT"}
                      </button>
                    </div>
                  </form>

                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
