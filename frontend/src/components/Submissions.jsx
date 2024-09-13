import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

const Submissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [access, setAccess] = useState('');
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const fetchSubmissions = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return navigate('/login');
    }
  
    try {
      const response = await fetch(`${API_BASE_URL}/submissions`, {
        method: "GET",
        headers: {
          authorization: token,
        }
      });
      const json = await response.json();
  
      setSubmissions(json.reverse());
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  };
  
  const logout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUsername("");
    setAccess("user");
    localStorage.setItem('isLoggedIn', false);
  };

  useEffect(() => {
    fetchSubmissions();
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
      <div className="container mx-auto py-8">
        <div className="bg-white shadow-md rounded-md p-6">
          <h1 className="text-3xl font-bold mb-4">Submissions</h1>
          <table className="w-full bg-white shadow rounded-md">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="px-4 py-2 text-left">Index</th>
                <th className="px-4 py-2 text-left">Username</th>
                <th className="px-4 py-2 text-left">Problem Name</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2">{submission.submissionIndex}</td>
                  <td className="px-4 py-2">{submission.username}</td>
                  <td className="px-4 py-2">{submission.problemName}</td>
                  <td className="px-4 py-2">
                    <span className={`font-bold ${submission.status === 'ACCEPTED' ? 'text-green-500' : 'text-red-500'}`}>
                      {submission.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Submissions;
