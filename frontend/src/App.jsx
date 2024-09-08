import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './components/Home.jsx'
import Register from './components/Register.jsx'
import Login from './components/Login.jsx'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path = "/" element={<Home />}></Route>
          <Route path = "/login" element={<Login />}></Route>
          <Route path = "/register" element={<Register />}></Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
