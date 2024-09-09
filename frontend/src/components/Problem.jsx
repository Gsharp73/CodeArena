import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import '../index.css';
// import './style/problempage.css';

const Problem = () => {
  const [problem, setProblem] = useState("");
  const [logs, setLogs] = useState("");
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");
  const [output, setOutput] = useState("");
  const [input, setInput] = useState("");
  const [yourOutput, setYourOutput] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const loadProblem = async () => {
    if (!token) {
      return navigate('/login');
    }

    try {
      const response = await fetch(`http://127.0.0.1:3000${location.pathname}`, {
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

  const onSubmit = async () => {
    setResult("PENDING");
    setLogs("LOGS");

    try {
      const response = await fetch('http://127.0.0.1:3000/submission', {
        method: "POST",
        headers: {
          authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'title': problem.title,
          'code': code,
          'username': localStorage.getItem('username'),
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

  useEffect(() => {
    loadProblem();
  }, []);

  const statuscolor = () => {
    switch (result) {
      case "ACCEPTED":
        return "green";
      case "PENDING":
        return "white";
      default:
        return "#af1a2a";
    }
  };

  return (
    <div id = "problempage">
      <div id = "left">
        <h1> {problem.title} </h1>
        <h4>DESCRIPTION</h4>
        <div id="problemdescription">
          <p>{problem.description}</p>
        </div>
      </div>
      <div id="right">
        <textarea
          id="textarea"
          onChange={(e) => setCode(e.target.value)}
        ></textarea>
        <br />
        <button id="submitbutton" onClick={onSubmit}>SUBMIT</button>
        <p style={{ color: statuscolor() }}>{result}</p>
        <p>
          <pre>{logs}</pre>
        </p>
        <div id="statusbox">
          <div id="status-input">
            <p>INPUT</p>
            <p>{input}</p>
          </div>
          <div id="status-input">
            <p>OUTPUT</p>
            <p>{output}</p>
          </div>
          <div id="status-input">
            <p>USER OUTPUT</p>
            <p>{yourOutput}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Problem;
