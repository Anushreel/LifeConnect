// import React from "react";
// import { useNavigate } from "react-router-dom";
// import "./Register.css";
// import doctorImg from "./doctor.png"; // Replace with the correct image path

// const Register = () => {
//   const navigate = useNavigate();

//   const handleRegister = (e) => {
//     e.preventDefault();
//     alert("Registration Successful! Redirecting to Login...");
//     navigate("/login"); // Redirect to login page
//   };

//   return (
//     <div className="register-container">
//       <h2>Welcome to <span className="highlight">LIFECONNECT</span></h2>
//       <form className="register-form" onSubmit={handleRegister}>
//         <label>User name <input type="text" required /></label>
//         <label>DOB <input type="date" required /></label>
//         <label>Height <input type="text" required /></label>
//         <label>Weight <input type="text" required /></label>
//         <label>Blood group <input type="text" required /></label>
//         <label>email <input type="email" required /></label>
//         <label>Phone <input type="text" required /></label>
//         <label>Password <input type="password" required /></label>
//         <label>Confirm password <input type="password" required /></label>
//         <button type="submit">Register</button>
//       </form>
//       <img src={doctorImg} alt="Doctor" className="doctor-image" />
//     </div>
//   );
// };

// export default Register;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import doctorImg from "./doctor.png"; 
import { authAPI } from "./api";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    dob: "",
    gender: "",
    height: "",
    weight: "",
    bloodGroup: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    is_admin:""
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData, [name]: value
    });
  };
  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("passwords do not match");
      return;
    }

    // Validate height and weight are numeric
    if (isNaN(parseInt(formData.height)) || isNaN(parseInt(formData.weight))) {
      setError("Height and weight must be valid numbers");
      return;
    }

    try {
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
        dob: formData.dob,
        gender: formData.gender,
        height: parseInt(formData.height),
        weight: parseFloat(formData.weight),
        blood_group: formData.bloodGroup,
        phno: formData.phone,
        is_admin:formData.is_admin==='true'
      };
      const response = await authAPI.register(userData);

      alert("Registration successful! Redirecting to Login..");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed please try again.");
      console.error("Registration error:", err);
    }
  };
  return (
    <div className="register-container">
      <h2>Welcome to <span className="highlight">LIFECONNECT</span></h2>
      {error && <div className="error-merssage">{error}</div>}
      <form className="register-form" onSubmit={handleRegister}>
        <label>User name<input type="text" name="username" value={formData.username} onChange={handleChange} required /></label>
        <label>Full name<input type="text" name="full_name" value={formData.full_name} onChange={handleChange} required /></label>
        <label>DOB <input type="date" name="dob" value={formData.dob} onChange={handleChange} required /></label>
        <label>Height in cm<input type="number" name="height" value={formData.height} onChange={handleChange} required /></label>
        <label>Weight in kg<input type="number" name="weight" value={formData.weight} onChange={handleChange} required /></label>
        <label>gender
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value={"female"}>Female</option>
            <option value={"male"}>Male</option>
          </select>
        </label>
        <label>Blood group <input type="text" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} required /></label>
        <label>Email <input type="email" name="email" value={formData.email} onChange={handleChange} required /></label>
        <label>Phone <input type="text" name="phone" value={formData.phone} onChange={handleChange} required /></label>
        <label>Password <input type="password" name="password" value={formData.password} onChange={handleChange} required /></label>
        <label>Confirm password <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required /></label>
        <label>Is admin
          <select name="is_admin" value={formData.is_admin} onChange={handleChange}>
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </label>
        <button type="submit">Register</button>
      </form>
      <img src={doctorImg} alt="Doctor" className="doctor-image" />
    </div>
  );
};
export default Register;