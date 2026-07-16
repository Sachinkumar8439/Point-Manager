import { useState } from 'react'
import Home from './pages/Home'
import AddChild from './pages/AddChild'
import ChildProfile from './pages/ChildProfile'
import AddTask from './pages/AddTask'
import AddPointsToAll from './pages/AddPointsToAll'
import Reports from './pages/Reports'
import ManageCommonTasks from './pages/ManageCommonTasks'
import Settings from './pages/Settings'
import { Route, Routes ,Link} from 'react-router-dom'
import { 
  FaHome, 
  FaTasks, 
  FaUserPlus, 
  FaChartBar, 
  FaCog,
  FaTrophy,
  FaPlus,
  FaMinus,
  FaStar,
  FaUserCircle
} from 'react-icons/fa';
import "./App.css";

function App() {
  const [count, setCount] = useState(0)
  const [member,setmember] = useState(null)
  
  const path  = window.location.pathname.split("/")[0] || "/";
  console.log(path)
  return (
   <div>
      <Routes>
        <Route path="/" element={<Home setmember={setmember} />} />
        <Route path="/p/:id" element={<ChildProfile member={member} setmember={setmember} />} />
        <Route path="/tasks" element={<ManageCommonTasks />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/addchild" element={<AddChild />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/add-task" element={<AddTask />} />
      </Routes>
      <nav className="bottom-nav">
              <Link to="/" className={`nav-item ${path==="/" && "active"}`}>
                <FaHome className="nav-icon" />
                <span>Home</span>
              </Link>
              <Link to="/tasks" className={`nav-item ${path==="tasks" && "active"}`}>
                <FaTasks className="nav-icon" />
                <span>Tasks</span>
              </Link>
              <Link to="/addchild" className={`nav-item ${path==="addchild" && "active"}`}>
                <FaUserPlus className="nav-icon" />
                <span>Add Child</span>
              </Link>
              <Link to="/reports" className={`nav-item ${path==="reports" && "active"}`}>
                <FaChartBar className="nav-icon" />
                <span>Reports</span>
              </Link>
              <Link to="/settings" className={`nav-item ${path==="settings" && "active"}`}>
                <FaCog className="nav-icon" />
                <span>Settings</span>
              </Link>
            </nav>
    </div>
  )
}

export default App
