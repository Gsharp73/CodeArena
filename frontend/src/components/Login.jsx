import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginResponse, setLoginResponse] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const response = await fetch('https://codearena-backend.vercel.app/login', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", email);
        localStorage.setItem('access', data.access);
        localStorage.setItem('isLoggedIn', true);
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <input
          className="w-full p-2 mb-4 border rounded"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full p-2 mb-4 border rounded"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="button"
          className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600"
          onClick={handleSubmit}
        >
          Submit
        </button>
        {loginResponse && <p className="mt-4 text-center text-red-500">{loginResponse}</p>}
      </div>
    </div>
  );
};

export default Login;
