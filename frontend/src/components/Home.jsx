import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [access, setAccess] = useState("user");
  const nav = useNavigate();

  const getBlogs = async () => {
    const response = await fetch('https://codearena-backend.vercel.app/blogs', {
      method: "GET",
    });
    const json = await response.json();
    setBlogs(json);
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
    getBlogs();
    const savedLoginState = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(savedLoginState);
  }, []);

  return (
    <div className="min-h-screen bg-blue-500">
      <Header isLoggedIn={isLoggedIn} username={username} access={access} logout={logout} />

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <h2 className="text-xl font-bold p-4 bg-gray-50 border-b">Blogs</h2>
          <div className="space-y-4 p-4">
            {blogs.length > 0 ? blogs.map((blog, index) => (
              <div key={blog.title} className="bg-white shadow-md rounded-lg p-4 border border-gray-300">
                <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
                <p className="text-gray-700 mb-4">{blog.content}</p>
                <p className="text-gray-500 text-sm">{blog.date}</p>
              </div>
            )) : (
              <p className="text-center text-gray-500">No blogs available</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
