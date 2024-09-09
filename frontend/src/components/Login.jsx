import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../index.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginResponse, setLoginResponse] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://127.0.0.1:3000/login', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", email);
        navigate(-1); // previous page
      } else {
        setLoginResponse(data.msg);
      }
    } catch (error) {
      console.error("Login failed:", error);
      setLoginResponse("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <input
        placeholder="Email"
        id="loginpage-input-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <input
        placeholder="Password"
        id="loginpage-input-password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <button type="button" onClick={handleSubmit}>Submit</button>
      <br />
      {loginResponse && <p className="login-response">{loginResponse}</p>}
    </div>
  );
};

export default Login;
