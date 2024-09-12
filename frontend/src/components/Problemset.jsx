import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

const ProblemSet = () => {
  const [problems, setProblems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [access, setAccess] = useState("user");
  const nav = useNavigate();

  const getProblems = async () => {
    const response = await fetch('https://codearena-backend.vercel.app/problems', {
      method: "GET",
    });
    const json = await response.json();
    setProblems(json);
  }

  const getaccess = async () => {
    const response = await fetch('https://codearena-backend.vercel.app/access', {
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
  }

  const logout = () => {
    const newLoginState = !isLoggedIn;
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    localStorage.removeItem('access');
    setIsLoggedIn(false);
    setUsername("");
    setAccess("user");
    localStorage.setItem('isLoggedIn', newLoginState);
  }
    
  const loginStatus = () => {
    const user = localStorage.getItem('username');
    if(user){
      setUsername(user);
      setIsLoggedIn(true);
      getaccess();
    } 
    else {
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
    <div className="min-h-screen bg-blue-500">
      <Header isLoggedIn={isLoggedIn} username={username} access={access} logout={logout} />

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <h2 className="text-xl font-bold p-4 bg-gray-50 border-b">Problem Set</h2>
          <table className="w-full table-fixed border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 w-1/12 text-left border border-gray-300">#</th>
                <th className="px-4 py-2 w-8/12 text-left border border-gray-300">Name</th>
                <th className="px-4 py-2 w-3/12 text-right border border-gray-300">Rating</th> 
              </tr>
            </thead>
            <tbody>
              {problems.length > 0 ? problems.map((prob, index) => (
                <tr key={prob.title} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 border border-gray-300">{index + 1}</td>
                  <td className="px-4 py-2 border border-gray-300">
                    {/* <a href={`/problem/${prob.title}`} className="text-blue-600 hover:underline">{prob.title}</a> */}
                    <a onClick={(e) => {
                      e.preventDefault();   
                      nav(`/problem/${prob.title}`);  
                      }
                    }
                    href="/"
                    className="text-blue-600 hover:underline"
                  >
                    {prob.title}
                  </a>
                  </td>
                  <td className="px-4 py-2 text-right border border-gray-300">{prob.rating}</td>
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
