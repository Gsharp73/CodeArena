import { useEffect, useState } from "react";
import Header from './Header';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ManageBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [access, setAccess] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchBlogs = async () => {
    if (!token) {
      return navigate('/login');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/blogs`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      const json = await response.json();
      if (access !== 'admin') {
        setBlogs(json.filter(blog => blog.username === username));
      } else {
        setBlogs(json);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const deleteBlog = async (id) => {
    if (!token) {
      return navigate('/login');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/manageblogs`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ blogId: id })
      });

      if (response.ok) {
        setBlogs(blogs.filter(blog => blog._id !== id));
        setStatusMessage('Blog deleted successfully');
      } else {
        setStatusMessage('Failed to delete blog');
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      setStatusMessage('Error deleting blog');
    }
  };

  const logout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('access');
    setIsLoggedIn(false);
    setUsername("");
    setAccess("user");
    localStorage.setItem('isLoggedIn', 'false');
    navigate('/login');
  };

  useEffect(() => {
    const loginState = localStorage.getItem('isLoggedIn') === 'true';
    const storedUsername = localStorage.getItem('username');
    const storedAccess = localStorage.getItem('access');
    setIsLoggedIn(loginState);
    setUsername(storedUsername || '');
    setAccess(storedAccess || '');
  }, []);

  useEffect(() => {
    if (access) {
      fetchBlogs();
    }
  }, [access]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Header 
        isLoggedIn={isLoggedIn} 
        username={username} 
        logout={logout} 
        access={access} 
      />
      <div className="container mx-auto py-8">
        <div className="bg-gray-800 shadow-lg rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-6 text-center">Manage Your Blogs</h1>
          {statusMessage && (
            <p className={`text-center ${statusMessage.includes('Error') ? 'text-red-400' : 'text-green-400'} mb-4`}>
              {statusMessage}
            </p>
          )}
          {blogs.length > 0 ? (
            <ul className="space-y-4">
              {blogs.map((blog) => (
                <li key={blog._id} className="flex justify-between items-center p-4 bg-gray-800 border border-gray-700 rounded-md">
                  <span className="text-lg font-semibold">{blog.title}</span>
                  <button
                    onClick={() => deleteBlog(blog._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-400">No blogs available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageBlogs;
