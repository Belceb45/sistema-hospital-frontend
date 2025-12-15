import { Routes, Route, Outlet } from 'react-router-dom'
import Home from './Home';
import Register from './register/register';
import Login from './login/login';
import PrivateRoute from './lib/privateRoute';
import Board from './dashboard/Board';
import Citas from './citas/cita'
import Nueva from './citas/new/nueva'
import Profile from './profile/profile';
function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Home></Home>}></Route>
        <Route path='/register' element={<Register></Register>}></Route>
        <Route path='/login' element={<Login></Login>}></Route>

        {/*Rutas protegidas*/}
        <Route element={<PrivateRoute><Outlet /></PrivateRoute>}>
          <Route path='/board' element={<Board />} />
          <Route path='/citas' element={<Citas />} />
          <Route path='/citas/nueva' element={<Nueva />} />
          <Route path='/profile' element={<Profile/>}/>
        </Route>

      </Routes>
    </>
  )
}

export default App
