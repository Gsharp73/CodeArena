import { useEffect, useState } from "react";
import Header from './Header';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [access, setAccess] = useState('');
  const [visibility, setVisibility] = useState('public');
  
  const authToken = localStorage.getItem('token');
  const navigate = useNavigate();

  const submitBlog = async () => {
    setStatusMessage("Submitting...");
    if (!isLoggedIn) {
      setStatusMessage('Login Required!!');
      return;
    }

    const response = await fetch(`${API_BASE_URL}/createblog`, {
      method: "POST",
      body: JSON.stringify({
        title,
        content,
        visibility,
        username, 
        date: new Date().toISOString() 
      }),
      headers: {
        'Content-Type': 'application/json',
        authorization: authToken,
      }
    });

    const data = await response.json();
    setStatusMessage(data.msg);

    if (data.success) {
      navigate('/');
    }
  };

  const logout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    localStorage.removeItem('access');
    setIsLoggedIn(false);
    setUsername("");
    setAccess("user");
    navigate('/');
  };

  useEffect(() => {
    const loginState = localStorage.getItem('isLoggedIn') === 'true';
    const storedUsername = localStorage.getItem('username');
    const storedAccess = localStorage.getItem('access');
    setIsLoggedIn(loginState);
    setUsername(storedUsername || '');
    setAccess(storedAccess || '');
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header 
        isLoggedIn={isLoggedIn} 
        username={username} 
        logout={logout} 
        access={access} 
      />
      <div id="CreateBlog" className="flex flex-col justify-center items-center min-h-screen bg-gray-900 p-8">
        <div className="w-[85%] max-w-5xl bg-[#1B1F23] p-10 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-center text-white">Create New Blog</h2>
          <div className="mb-6">
            <label className="block text-lg font-bold mb-2 text-white">Blog Title</label>
            <textarea 
              className="w-full p-3 border border-gray-600 bg-gray-800 text-white rounded mb-4"
              placeholder="Enter blog title"
              onChange={(e) => setTitle(e.target.value)}
            />
            <label className="block text-lg font-bold mb-2 text-white">Content</label>
            <textarea
              className="w-full p-3 border border-gray-600 bg-gray-800 text-white rounded mb-4"
              placeholder="Write your blog content here"
              id="content-area"
              onChange={(e) => setContent(e.target.value)}
              rows="12"  
            />
            <label className="block text-lg font-bold mb-2 text-white">Visibility</label>
            <select
              className="w-full p-3 border border-gray-600 bg-gray-800 text-white rounded mb-4"
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
          <button 
            type="button" 
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
            onClick={submitBlog}
          >
            Submit Blog
          </button>
          <p className="mt-4 text-center text-white">{statusMessage}</p>
        </div>
      </div>
    </div>
  );
};

export default CreateBlog;
