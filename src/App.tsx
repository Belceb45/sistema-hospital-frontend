import { Routes, Route, Link } from 'react-router-dom'
import { Activity, Calendar, FileText, Home as HomeIcon, Link as LinkIcon, User } from "lucide-react"
import Button from "@mui/material/Button";
import Home from './Home';
import Register from './register/register';
import Login from './login/login';
function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Home></Home>}></Route>
        <Route path='/register' element={<Register></Register>}></Route>
        <Route path='/login' element={<Login></Login>}></Route>
      </Routes>
    </>
  )
}

export default App
