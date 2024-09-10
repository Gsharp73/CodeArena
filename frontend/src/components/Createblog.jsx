import { useEffect, useState } from "react";
import Header from './Header';
import { useNavigate } from 'react-router-dom';

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(``);
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [access, setAccess] = useState('');
  
  const authToken = localStorage.getItem('token');
  const navigate = useNavigate();

  const submitBlog = async () => {
    setStatusMessage("Submitting...");
    if (isLoggedIn === false) {
      setStatusMessage('Login Required!!');
      return;
    }
    const response = await fetch('http://127.0.0.1:3000/createblog', {
      method: "POST",
      body: JSON.stringify({
        title,
        content,
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
    const newLoginState = !isLoggedIn;
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUsername("");
    setAccess("user");
    localStorage.setItem('isLoggedIn', newLoginState);
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
    <div className="min-h-screen bg-blue-500">
      <Header 
        isLoggedIn={isLoggedIn} 
        username={username} 
        logout={logout} 
        access={access} 
      />
      <div id="CreateBlog" className="min-h-screen bg-gray-100 p-8">
        <h2 className="text-3xl font-bold mb-6">Create New Blog</h2>
        <div className="mb-6">
          <label className="block text-lg font-bold mb-2">Blog Title</label>
          <textarea 
            className="w-full p-3 border rounded mb-4"
            placeholder="Enter blog title"
            onChange={(e) => setTitle(e.target.value)}
          />
          <label className="block text-lg font-bold mb-2">Content</label>
          <textarea
            className="w-full p-3 border rounded mb-4"
            placeholder="Write your blog content here"
            id="content-area"
            onChange={(e) => setContent(e.target.value)}
            rows="10"
          />
        </div>
        <button 
          type="button" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={submitBlog}
        >
          Submit Blog
        </button>
        <p className="mt-4">{statusMessage}</p>
      </div>
    </div>
  );
};

export default CreateBlog;
