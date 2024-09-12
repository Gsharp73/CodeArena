import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
      const response = await fetch('https://codearena-backend.vercel.app/register', {
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        <input
          className="w-full p-2 mb-4 border rounded"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full p-2 mb-4 border rounded"
          placeholder="Enter your password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="button"
          className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600"
          onClick={handleSubmit}
        >
          Register
        </button>
        <p className="mt-4 text-center text-red-500">{responseMessage}</p>
      </div>
    </div>
  );
};

export default Register;
