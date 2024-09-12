import { useEffect, useState } from "react";
import Header from './Header';

const Createprob = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState("");
  const [testInput, setTestInput] = useState("");
  const [testOutput, setTestOutput] = useState("");
  const [testCases, updateTestCases] = useState([]);
  const [memoryLimit, setMemoryLimit] = useState("");
  const [timeLimit, setTimeLimit] = useState("1");
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [access, setAccess] = useState('');
  
  const authToken = localStorage.getItem('token');

  const submitProblem = async () => {
    setStatusMessage("Submitting...");
    
    const response = await fetch('https://codearena-backend.vercel.app/createproblem', {
      method: "POST",
      body: JSON.stringify({
        title,
        description,
        rating,  
        testcase: testCases,
        memlimit: memoryLimit,
        timelimit: timeLimit,
      }),
      headers: {
        'Content-Type': 'application/json',
        authorization: authToken,
      }
    });

    const data = await response.json();
    setStatusMessage(data.msg);
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
    const loginState = localStorage.getItem('isLoggedIn') === 'true';
    const storedUsername = localStorage.getItem('username');
    const storedAccess = localStorage.getItem('access');
    setIsLoggedIn(loginState);
    setUsername(storedUsername || '');
    setAccess(storedAccess || '');
  }, []);

  const addTestCase = () => {
    updateTestCases([...testCases, {
      input: testInput,
      output: testOutput
    }]);
    setStatusMessage(`Testcase ${testCases.length + 1} added`);
  };

  return (
    <div className="min-h-screen bg-blue-500">
      <Header 
          isLoggedIn={isLoggedIn} 
          username={username} 
          logout={logout} 
          access={access} 
      />
      <div id="Createprob" className="min-h-screen bg-gray-100 p-8">
        <h2 className="text-3xl font-bold mb-6">Create New Problem</h2>
        <table className="w-full text-left table-auto mb-6">
          <tbody>
            <tr>
              <td className="py-2 pr-4 font-bold">Problem Title</td>
              <td>
                <textarea 
                  className="w-full p-3 border rounded"
                  placeholder="Enter problem title"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td className="py-2 pr-4 font-bold">Problem Description</td>
              <td>
                <textarea
                  className="w-full p-3 border rounded"
                  placeholder="Provide detailed description with sample input/output"
                  id="description-area"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td className="py-2 pr-4 font-bold">Rating</td>
              <td>
                <input 
                  type="number"
                  className="w-full p-3 border rounded"
                  placeholder="Enter problem rating (e.g., 1000)"
                  onChange={(e) => setRating(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td className="py-2 pr-4 font-bold">Memory Limit (MB)</td>
              <td>
                <textarea
                  className="w-full p-3 border rounded"
                  placeholder="Default is 256 MB"
                  onChange={(e) => setMemoryLimit(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td className="py-2 pr-4 font-bold">Time Limit (in seconds)</td>
              <td>
                <select 
                  className="w-full p-2 border rounded"
                  onChange={(e) => setTimeLimit(e.target.value)}
                >
                  {[...Array(10).keys()].map(i => <option key={i + 1}>{i + 1}</option>)}
                </select>
              </td>
            </tr>
            <tr>
              <td className="py-2 pr-4 font-bold">Test Case Input</td>
              <td>
                <textarea 
                  className="w-full p-3 border rounded"
                  placeholder="Provide input for the test case"
                  onChange={(e) => setTestInput(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td className="py-2 pr-4 font-bold">Test Case Output</td>
              <td>
                <textarea 
                  className="w-full p-3 border rounded"
                  placeholder="Provide expected output for the test case"
                  onChange={(e) => setTestOutput(e.target.value)}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <button 
          type="button" 
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4"
          onClick={addTestCase}
        >
          Add Test Case
        </button>
        <br />
        <button 
          type="button" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={submitProblem}
        >
          Submit Problem
        </button>
        <p className="mt-4">{statusMessage}</p>
      </div>
    </div>
  );
};

export default Createprob;
