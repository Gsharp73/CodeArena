import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import Header from './Header';
import { useNavigate } from 'react-router-dom';

const CodeEditor = () => {
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [output, setOutput] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [access, setAccess] = useState('');
  const navigate = useNavigate();

  const handleRun = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/runcode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, input, language }),
      });

      const result = await response.json();
      setOutput(result.output || result.error);
    } catch (error) {
      console.error("Error running code:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    localStorage.removeItem('access');
    setIsLoggedIn(false);
    setUsername("");
    setAccess("user");
    localStorage.setItem('isLoggedIn', false);
    navigate('/login');
  };

  useEffect(() => {
    const loginState = localStorage.getItem('isLoggedIn') === 'true';
    const storedUsername = localStorage.getItem('username');
    const storedAccess = localStorage.getItem('access');
    setIsLoggedIn(loginState);
    setUsername(storedUsername || '');
    setAccess(storedAccess || '');
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <Header 
        isLoggedIn={isLoggedIn} 
        username={username} 
        logout={logout} 
        access={access} 
      />
      <div className="container mx-auto p-8">
        <div className="bg-gray-800 shadow-md rounded-md p-6">
          <div className="flex flex-col lg:flex-row">
            <div className="w-full lg:w-1/2 lg:pr-4 mb-4 lg:mb-0">
              <label htmlFor="language-select" className="block text-lg font-semibold mb-2 text-gray-300">Choose Language:</label>
              <select
                id="language-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="border border-gray-600 rounded px-3 py-2 mb-4 w-full bg-gray-700 text-gray-200"
              >
                <option value="cpp">C++</option>
                <option value="py">Python</option>
              </select>

              <Editor
                height="60vh"
                language={language}
                value={code}
                onChange={(value) => setCode(value)}
                options={{ automaticLayout: true, theme: 'vs-dark' }}
              />
            </div>

            <div className="w-full lg:w-1/2 lg:pl-4 flex flex-col">
              <div className="mb-4">
                <label htmlFor="input" className="block text-lg font-semibold mb-2 text-gray-300">Input:</label>
                <textarea
                  id="input"
                  className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-gray-200"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  rows={10}
                />
              </div>

              <div>
                <label htmlFor="output" className="block text-lg font-semibold mb-2 text-gray-300">Output:</label>
                <div className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-gray-200 h-40 overflow-y-auto">
                  <pre>{output || "Your output will appear here..."}</pre>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleRun}
            className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Run Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
