// import React from "react";
// import { useNavigate } from "react-router-dom";
// import "./Login.css"; // External CSS for styling
// import doctorImg from "./doctor.png"; // Replace with correct path to image

// const Login = () => {
//   const navigate = useNavigate();
//   const handleLogin = (e) => {
//     e.preventDefault();
//     navigate("/mainpage"); // Redirect to dashboard
//   };

//   return (
//     <div className="login-container">
//       <h2 className="login-title">Welcome to <span className="highlight">LIFECONNECT</span></h2>
//       <form className="login-form" onSubmit={handleLogin}>
//         <label>user name</label>
//         <input type="text" required />

//         <label>password</label>
//         <input type="password" required />

//         <button type="submit" className="login-button">Login</button>
//       </form>
//       <img src={doctorImg} alt="Doctor" className="doctor-image" />
//     </div>
//   );
// };

// export default Login;

import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // External CSS for styling
import doctorImg from "./doctor.png"; 
import { authAPI } from "./api";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await authAPI.login(username, password);
      //local store to save token
      localStorage.setItem("access_token", response.data.access_token);
      console.log("login successful, token:", response.data.access_token);

      // redirect to main
      navigate("/mainpage");
    } catch (err) {
      console.error("Failed to login: ", err);
      setError("Incorrect username or password");
    }
  };
  const handleRegisteration = async (e) => {
    e.preventDefault();
    navigate("/register")
  };
  return (
    <div className="login-container">
      <h2 className="login-title">
        Welcome to <span className="highlight">LIFECONNECT</span>
      </h2>
      <form className="login-form" onSubmit={handleLogin}>
        <label>User name</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" className="login-button">
          Login
        </button>
      </form>
      <form onClick={handleRegisteration}>
        <button type="button" className="register-button">
          Register
        </button>
      </form>
      <img src={doctorImg} alt="Doctor" className="doctor-image" />
    </div>
  );
};
export default Login;