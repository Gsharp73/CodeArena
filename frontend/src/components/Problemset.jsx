import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProblemSet = () => {
  const [problems, setProblems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [access, setAccess] = useState("user");
  const nav = useNavigate();

  const getProblems = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/problems`, {
        method: "GET",
      });
      const json = await response.json();
      setProblems(json);
    } catch (error) {
      console.error("Error fetching problems:", error);
    }
  }

  const getAccess = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/access`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "username": localStorage.getItem('username'),
        })
      });
      const json = await response.json();
      setAccess(json.access);
    } catch (error) {
      console.error("Error fetching access:", error);
    }
  }

  const logout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    localStorage.removeItem('access');
    setIsLoggedIn(false);
    setUsername("");
    setAccess("user");
    localStorage.setItem('isLoggedIn', 'false');
  }
    
  const loginStatus = () => {
    const user = localStorage.getItem('username');
    if (user) {
      setUsername(user);
      setIsLoggedIn(true);
      getAccess();
    } else {
      setIsLoggedIn(false);
    }
  }

  useEffect(() => {
    loginStatus();
    getProblems();
    const savedLoginState = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(savedLoginState);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <Header isLoggedIn={isLoggedIn} username={username} access={access} logout={logout} />

      <main className="container mx-auto px-4 py-8">
        <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <h2 className="text-2xl font-bold p-4 bg-gray-700 border-b border-gray-600">Problem Set</h2>
          <table className="w-full table-fixed border-collapse border border-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left border border-gray-600">#</th>
                <th className="px-4 py-2 text-left border border-gray-600">Name</th>
                <th className="px-4 py-2 text-right border border-gray-600">Rating</th> 
              </tr>
            </thead>
            <tbody>
              {problems.length > 0 ? problems.map((prob, index) => (
                <tr key={prob.title} className="border-t hover:bg-gray-600 transition-colors">
                  <td className="px-4 py-2 border border-gray-600">{index + 1}</td>
                  <td className="px-4 py-2 border border-gray-600">
                    <a onClick={(e) => {
                      e.preventDefault();
                      nav(`/problem/${prob.title}`);
                    }}
                    href="/"
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {prob.title}
                  </a>
                  </td>
                  <td className="px-4 py-2 text-right border border-gray-600">{prob.rating}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="3" className="px-4 py-2 text-center text-gray-500">No problems available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default ProblemSet;
