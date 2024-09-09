import { useState } from "react";

const Createprob = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [testInput, setTestInput] = useState("");
  const [testOutput, setTestOutput] = useState("");
  const [testCases, updateTestCases] = useState([]);
  const [memoryLimit, setMemoryLimit] = useState("");
  const [timeLimit, setTimeLimit] = useState("1");
  const [statusMessage, setStatusMessage] = useState("");
  
  const authToken = localStorage.getItem('token');

  const submitProblem = async () => {
    setStatusMessage("Submitting...");
    
    const response = await fetch('http://127.0.0.1:3000/createproblem', {
      method: "POST",
      body: JSON.stringify({
        title,
        description,
        difficulty,
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

  const addTestCase = () => {
    updateTestCases([...testCases, {
      input: testInput,
      output: testOutput
    }]);
    setStatusMessage(`Testcase ${testCases.length + 1} added`);
  };

  return (
    <div id="Createprob">
      <h2>Create New Problem</h2>
      <table>
        <tbody>
          <tr>
            <td>Problem Title</td>
            <td>
              <textarea 
                placeholder="Enter problem title"
                onChange={(e) => setTitle(e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <td>Problem Description</td>
            <td>
              <textarea
                placeholder="Provide detailed description with sample input/output"
                id="description-area"
                onChange={(e) => setDescription(e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <td>Difficulty Level</td>
            <td>
              <select onChange={(e) => setDifficulty(e.target.value)}>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>Time Limit (in seconds)</td>
            <td>
              <select onChange={(e) => setTimeLimit(e.target.value)}>
                {[...Array(15).keys()].map(i => <option key={i + 1}>{i + 1}</option>)}
              </select>
            </td>
          </tr>
          <tr>
            <td>Test Case Input</td>
            <td>
              <textarea 
                placeholder="Provide input for the test case"
                className="testcase"
                onChange={(e) => setTestInput(e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <td>Memory Limit (MB)</td>
            <td>
              <textarea
                placeholder="Default is 256 MB"
                onChange={(e) => setMemoryLimit(e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <td>Test Case Output</td>
            <td>
              <textarea 
                placeholder="Provide expected output for the test case"
                className="testcase"
                onChange={(e) => setTestOutput(e.target.value)}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <p>Add test cases one at a time.</p>
      <button type="button" onClick={addTestCase}>Add Test Case</button>
      <br />
      <button type="button" onClick={submitProblem}>Submit Problem</button>
      <p>{statusMessage}</p>
    </div>
  );
};

export default Createprob;
