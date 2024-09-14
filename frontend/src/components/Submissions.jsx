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
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Header 
        isLoggedIn={isLoggedIn} 
        username={username} 
        logout={logout} 
        access={access} 
      />
      <div className="container mx-auto py-8 px-4">
        <div className="bg-gray-800 shadow-lg rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-6 text-blue-400">Submissions</h1>
          <div className="overflow-x-auto">
            <table className="w-full bg-gray-700 border border-gray-600 rounded-lg">
              <thead>
                <tr className="bg-gray-600 border-b border-gray-500">
                  <th className="px-6 py-3 text-left text-gray-200">Index</th>
                  <th className="px-6 py-3 text-left text-gray-200">Username</th>
                  <th className="px-6 py-3 text-left text-gray-200">Problem Name</th>
                  <th className="px-6 py-3 text-left text-gray-200">Status</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission, index) => (
                  <tr key={index} className="border-b border-gray-600 hover:bg-gray-600 transition-colors">
                    <td className="px-6 py-4">{submission.submissionIndex}</td>
                    <td className="px-6 py-4">{submission.username}</td>
                    <td className="px-6 py-4">{submission.problemName}</td>
                    <td className="px-6 py-4">
                      <span className={`font-semibold ${submission.status === 'ACCEPTED' ? 'text-green-400' : 'text-red-400'}`}>
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
    </div>
  );
};

export default Submissions;
