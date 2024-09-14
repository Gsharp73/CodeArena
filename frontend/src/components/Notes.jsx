import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { formatDistanceToNow, parseISO } from 'date-fns';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Notes = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [access, setAccess] = useState("user");
  const nav = useNavigate();

  const getNotes = async () => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    if (!username) {
      console.error('Username is not available in localStorage');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/notes`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const json = await response.json();
      const filteredNotes = json.filter(note => note.visibility === 'private');
      setBlogs(filteredNotes);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

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
      console.error('Error fetching access level:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    localStorage.removeItem('access');
    setIsLoggedIn(false);
    setUsername("");
    setAccess("user");
    localStorage.setItem('isLoggedIn', 'false');
    nav('/login');
  };

  const loginStatus = () => {
    const user = localStorage.getItem('username');
    if (user) {
      setUsername(user);
      setIsLoggedIn(true);
      getAccess();
    } else {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    loginStatus();
    getNotes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Header 
        isLoggedIn={isLoggedIn} 
        username={username} 
        access={access} 
        logout={logout} 
      />
      <main className="container mx-auto px-4 py-8">
        <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <h2 className="text-2xl font-bold p-4 bg-gray-700 border-b border-gray-600">
            My Notes (Private Blogs)
          </h2>
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
                <div key={index} className="bg-gray-700 shadow-md rounded-lg p-4 border border-gray-600">
                  <h3 className="text-xl font-semibold mb-2">
                    {blog.title}
                    {(blog.username || dateString) && (
                      <span className="block text-gray-400 text-sm mt-1">
                        {blog.username ? `By ${blog.username}` : ''}
                        {dateString ? `, ${dateString}` : ''}
                      </span>
                    )}
                  </h3>
                  
                  {/* Preserve line breaks in the content */}
                  <div 
                    className="text-gray-300 mb-4" 
                    dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br/>') }}
                  />
                </div>
              );
            }) : (
              <p className="text-center text-gray-400">No private notes available</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Notes;
