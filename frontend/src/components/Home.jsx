import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { formatDistanceToNow, parseISO } from 'date-fns';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [access, setAccess] = useState("user");
  const nav = useNavigate();

  const getBlogs = async () => {
    const response = await fetch(`${API_BASE_URL}/blogs`, {
      method: "GET",
    });
    const json = await response.json();
    // console.log(json);
    const filteredBlogs = json.filter(blog => !blog.visibility || blog.visibility === 'public').reverse();
    console.log(filteredBlogs);
    setBlogs(filteredBlogs);
  }

  const getAccess = async () => {
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
            {blogs.length > 0 ? blogs.map((blog, index) => {
              let dateString = '';
              try {
                const date = blog.date ? parseISO(blog.date) : null;
                if (date && !isNaN(date.getTime())) {
                  dateString = formatDistanceToNow(date, { addSuffix: true });
                }
              } catch (error) {
                console.error('Error formatting date:', error);
              }

              return (
                <div key={index} className="bg-white shadow-md rounded-lg p-4 border border-gray-300">
                  <h3 className="text-xl font-semibold mb-2">
                    {blog.title}
                    {(blog.username || dateString) && (
                      <span className="block text-gray-500 text-sm mt-1">
                        {blog.username ? `By ${blog.username}` : ''}
                        {dateString ? `, ${dateString}` : ''}
                      </span>
                    )}
                  </h3>
                  
                  {/* Preserve line breaks in the content */}
                  <div 
                    className="text-gray-700 mb-4" 
                    dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br/>') }}
                  />
                </div>
              );
            }) : (
              <p className="text-center text-gray-500">No blogs available</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
export default Home;
