import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import '../index.css';
import Editor from '@monaco-editor/react';
import Header from './Header';

const Problem = () => {
  const [problem, setProblem] = useState("");
  const [logs, setLogs] = useState("");
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");
  const [output, setOutput] = useState("");
  const [input, setInput] = useState("");
  const [yourOutput, setYourOutput] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [access, setAccess] = useState('');

  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const loadProblem = async () => {
    if (!token) {
      return navigate('/login');
    }

    try {
      const response = await fetch(`https://codearena-backend.vercel.app${location.pathname}`, {
        method: "GET",
        headers: {
          authorization: token,
        }
      });

      const json = await response.json();
      setProblem(json);
    } catch (error) {
      console.error("Error fetching problem:", error);
    }
  };

  const logout = () => {
    const newLoginState = !isLoggedIn;
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUsername("");
    setAccess("user");
    localStorage.setItem('isLoggedIn', newLoginState);
  }

  useEffect(() => {
    loadProblem();
    const loginState = localStorage.getItem('isLoggedIn') === 'true';
    const storedUsername = localStorage.getItem('username');
    const storedAccess = localStorage.getItem('access');
    setIsLoggedIn(loginState);
    setUsername(storedUsername || '');
    setAccess(storedAccess || '');
  }, []);

  const onSubmit = async () => {
    setResult("PENDING");
    setLogs("LOGS");

    try {
      console.log(code);
      const response = await fetch('https://codearena-backend.vercel.app/testing', {
        method: "POST",
        headers: {
          authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'title': problem.title,
          'code': code,
          'username': localStorage.getItem('username'),
          'language': language,
        }),
      });

      const received = await response.json();
      setResult(received.result);
      setLogs(received.log);
      setOutput(received.output);
      setInput(received.input);
      setYourOutput(received.youroutput);
    } catch (error) {
      console.error("Error submitting code:", error);
    }
  };

  const statuscolor = () => {
    switch (result) {
      case "ACCEPTED":
        return "text-green-400";
      case "PENDING":
        return "text-yellow-600";
      default:
        return "text-red-800";
    }
  };

  return (
    <div className="min-h-screen bg-blue-500">
      <Header 
        isLoggedIn={isLoggedIn} 
        username={username} 
        logout={logout} 
        access={access} 
      />
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow-md rounded-md p-6" >
            <h1 className="text-3xl font-bold mb-4">{problem.title}</h1>
            <h4 className="text-xl font-semibold">DESCRIPTION</h4>
            <div className="my-4 p-4 bg-gray-50 rounded">
              <p>{problem.description}</p>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-md p-6">
            <div className="mb-4">
              <label htmlFor="language-select" className="block text-lg font-semibold mb-2">Choose Language:</label>
              <select
                id="language-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="border rounded px-3 py-2 w-full"
              >
                <option value="cpp">C++</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
              </select>
            </div>

            <Editor
              height="400px"
              language={language}
              value={code}
              onChange={(value) => setCode(value)}
              options={{ automaticLayout: true }}
              style={{ border: "1px solid #ccc", borderRadius: "4px" }} 
            />
            <button 
              id="submitbutton" 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
              onClick={onSubmit}
            >
              SUBMIT
            </button>
            <p className={`text-xl font-semibold ${statuscolor()}`}>{result}</p>
            <pre className="bg-gray-100 p-4 mt-4 rounded">{logs}</pre>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-100 rounded shadow">
                <h4 className="font-bold">INPUT</h4>
                <p>{input}</p>
              </div>
              <div className="p-4 bg-gray-100 rounded shadow">
                <h4 className="font-bold">OUTPUT</h4>
                <p>{output}</p>
              </div>
              <div className="p-4 bg-gray-100 rounded shadow">
                <h4 className="font-bold">USER OUTPUT</h4>
                <p>{yourOutput}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Problem;
