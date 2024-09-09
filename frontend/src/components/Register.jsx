import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../index.css';

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!password) {
      setResponseMessage("Password cannot be blank");
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:3000/register', {
        method: "POST",
        headers: {
          'Content-Type': "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();
      if (response.status === 200) {
        navigate(-1);
      } else {
        setResponseMessage(data.msg);
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setResponseMessage("An error occurred");
    }
  };

  return (
    <div>
      <input
        placeholder="Enter your email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="Enter your password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <button type="button" onClick={handleSubmit}>Sign Up</button>
      <br />
      {responseMessage}
    </div>
  );
};

export default Register;
