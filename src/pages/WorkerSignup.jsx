import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../components/worker/worker.css";

const WorkerSignup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    workerId: "",
    emergencyContact: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });

  const [otpSent, setOtpSent] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const sendOtp = () => {
    if (formData.mobile.length === 10) {
      alert("OTP sent (demo OTP: 1234)");
      setOtpSent(true);
    } else {
      alert("Enter valid 10-digit mobile number");
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();

    if (formData.otp !== "1234") {
      alert("Invalid OTP");
      return;
    }

    if (formData.password.length < 4) {
      alert("Password must be at least 4 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // ✅ Save worker data
    localStorage.setItem(
      "workerData",
      JSON.stringify({
        name: formData.name,
        mobile: formData.mobile,
        workerId: formData.workerId,
        emergencyContact: formData.emergencyContact,
        password: formData.password, // prototype only
      })
    );

    alert("Signup successful!");
    navigate("/");
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSignup}>
        <h2 className="login-title">Worker Signup</h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="login-input"
          required
        />

        <input
          type="tel"
          name="mobile"
          placeholder="Mobile Number"
          value={formData.mobile}
          onChange={handleChange}
          className="login-input"
          required
        />

        {!otpSent ? (
          <button
            type="button"
            className="login-btn secondary-btn"
            onClick={sendOtp}
          >
            Send OTP
          </button>
        ) : (
          <input
            type="text"
            name="otp"
            placeholder="Enter OTP"
            value={formData.otp}
            onChange={handleChange}
            className="login-input"
            required
          />
        )}

        <input
          type="text"
          name="workerId"
          placeholder="Worker ID"
          value={formData.workerId}
          onChange={handleChange}
          className="login-input"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="New Password"
          value={formData.password}
          onChange={handleChange}
          className="login-input"
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="login-input"
          required
        />

        <input
          type="tel"
          name="emergencyContact"
          placeholder="Emergency Contact Number"
          value={formData.emergencyContact}
          onChange={handleChange}
          className="login-input"
          required
        />

        <button type="submit" className="login-btn">
          Sign Up
        </button>

        <p className="login-link">
          Already registered?{" "}
          <span onClick={() => navigate("/")}>Login</span>
        </p>
      </form>
    </div>
  );
};

export default WorkerSignup;
