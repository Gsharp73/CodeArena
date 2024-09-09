import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './components/Home.jsx'
import Register from './components/Register.jsx'
import Login from './components/Login.jsx'
import Problem from './components/Problem.jsx'
import Createprob from './components/Createproblem.jsx'
import UserProfile from './components/Profilepage.jsx'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path = "/" element={<Home />}></Route>
          <Route path = "/login" element={<Login />}></Route>
          <Route path = "/register" element={<Register />}></Route>
          <Route path = "/profile/:username" element={<UserProfile />}></Route>
          <Route path = "/problem/:id" element={<Problem />}></Route>
          <Route path = "/createproblem" element={<Createprob />}></Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
