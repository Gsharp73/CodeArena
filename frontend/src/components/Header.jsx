import { useNavigate } from 'react-router-dom';

const Header = ({ isLoggedIn, username, access, logout }) => {
  const nav = useNavigate();

  return (
    <>
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 onClick={() => nav('/')} className="text-3xl font-bold text-gray-800 cursor-pointer">CodeArena</h1>
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
            <li><a href="/" className="text-gray-700 font-semibold hover:text-black">HOME</a></li>
            <li><a href="/problemset" className="text-gray-700 font-semibold hover:text-black">PROBLEMSET</a></li>
            <li><a href="/createblog" className="text-gray-700 font-semibold hover:text-black">CREATE BLOG</a></li>
            {access === "admin" && (
              <>
                <li><a href="/createproblem" className="text-gray-700 font-semibold hover:text-black">SET PROBLEM</a></li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Header;
