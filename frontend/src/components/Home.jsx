import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [problems, setProblems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [access, setAccess] = useState("user");
  const nav = useNavigate();

  const getProblem = async () => {
    const response = await fetch('http://127.0.0.1:3000/', {
      method: "GET",
    });
    const json = await response.json();
    setProblems(json);
  }

  const getaccess = async () => {
    const response = await fetch('http://127.0.0.1:3000/access', {
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
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUsername("");
    setAccess("user");
  }
    
  const loginStatus = () => {
    const user = localStorage.getItem('username');
    if(user){
      setUsername(user);
      setIsLoggedIn(true);
      getaccess();
    } else {
      setIsLoggedIn(false);
    }
  }

  useEffect(() => {
    loginStatus();
    getProblem();
  }, []);

  return (
    <div className="min-h-screen bg-blue-500">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">CodeArena</h1>
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <span className="text-gray-700">{username}</span>
                <button onClick={logout} className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">Logout</button>
              </>
            ) : (
              <>
                <button onClick={() => nav('/login')} className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">Enter</button>
                <button onClick={() => nav('/register')} className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">Register</button>
              </>
            )}
          </div>
        </div>
      </header>

      <nav className="bg-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <ul className="flex space-x-8 py-3">
            <li><a href="#" className="text-gray-700 font-semibold hover:text-black">HOME</a></li>
            <li><a href="#" className="text-gray-700 font-semibold hover:text-black">PROBLEMSET</a></li>
            {access === "admin" && (
              <>
                <li><a href="/createproblem" className="text-gray-700 font-semibold hover:text-black">SET PROBLEM</a></li>
              </>
            )}
          </ul>
        </div>
      </nav>

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
                    <a href={`/problem/${prob.title}`} className="text-blue-600 hover:underline">{prob.title}</a>
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

export default Home;
