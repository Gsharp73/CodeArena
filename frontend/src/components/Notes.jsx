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
        },
        params: { username }
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const json = await response.json();
      console.log(json);
  
      // Filter for notes with visibility 'private'
      const filteredNotes = json.filter(note => note.visibility === 'private');
      console.log(filteredNotes);
      setBlogs(filteredNotes); // or setNotes if using a different state
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };
  

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
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    localStorage.removeItem('access');
    setIsLoggedIn(false);
    setUsername("");
    setAccess("user");
    localStorage.setItem('isLoggedIn', false);
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
    getNotes();
  }, []);

  return (
    <div className="min-h-screen bg-blue-500">
      <Header isLoggedIn={isLoggedIn} username={username} access={access} logout={logout} />

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <h2 className="text-xl font-bold p-4 bg-gray-50 border-b">My Notes (Private Blogs)</h2>
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
              <p className="text-center text-gray-500">No private notes available</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Notes
