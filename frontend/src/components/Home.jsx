import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [problems, setProblems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("user");
  const nav = useNavigate();

  const getProblem = async () => {
    const response = await fetch('http://127.0.0.1:3000/', {
      method: "GET",
    });
    const json = await response.json();
    setProblems(json);
  }

  const getRole = async () => {
    const response = await fetch('http://127.0.0.1:3000/role', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "username": localStorage.getItem('username'),
      })
    });
    const json = await response.json();
    setRole(json.role);
  }

  const logout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUsername("");
    setRole("user");
  }
    
  const loginStatus = () => {
    const user = localStorage.getItem('username');
    if(user){
      setUsername(user);
      setIsLoggedIn(true);
      getRole();
    } else {
      setIsLoggedIn(false);
    }
  }

  useEffect(() => {
    loginStatus();
    getProblem();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">CodeArena</h1>
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <button onClick={() => nav(`/profile/${username}`)} className="text-blue-600 hover:underline">{username}</button>
                <button onClick={logout} className="text-red-600 hover:underline">Logout</button>
              </>
            ) : (
              <>
                <button onClick={() => nav('/login')} className="text-blue-600 hover:underline">Enter</button>
                <button onClick={() => nav('/register')} className="text-blue-600 hover:underline">Register</button>
              </>
            )}
          </div>
        </div>
      </header>

      <nav className="bg-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <ul className="flex space-x-6 py-2">
            <li><a href="#" className="text-gray-700 hover:text-black">HOME</a></li>
            <li><a href="#" className="text-gray-700 hover:text-black">CONTESTS</a></li>
            <li><a href="#" className="text-gray-700 hover:text-black">PROBLEMSET</a></li>
            {role === "admin" && (
              <>
                <li><a href="/createcontests" className="text-gray-700 hover:text-black">CREATE CONTEST</a></li>
                <li><a href="/setproblem" className="text-gray-700 hover:text-black">SET PROBLEM</a></li>
              </>
            )}
          </ul>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Upcoming Contests</h2>
          <p className="text-gray-600">No upcoming contests at the moment.</p>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <h2 className="text-xl font-bold p-4 bg-gray-50 border-b">Problem Set</h2>
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-right">Difficulty</th>
              </tr>
            </thead>
            <tbody>
              {problems.map((prob) => (
                <tr key={prob.title} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <a href={`/problem/${prob.title}`} className="text-blue-600 hover:underline">{prob.title}</a>
                  </td>
                  <td className="px-4 py-2 text-right">{prob.difficulty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default Home;
