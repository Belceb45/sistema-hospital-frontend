import { Routes, Route, Outlet } from 'react-router-dom'
import Home from './Home';
import Register from './register/register';
import Login from './login/login';
import PrivateRoute from './lib/privateRoute';
import Board from './dashboard/Board';
import Citas from './citas/cita'
import Nueva from './citas/new/nueva'
import Profile from './profile/profile';
import Resultados from './lab/resultados';
import Footer from './components/Footer';
import Historial from './profile/historial';
function App() {

  return (
    <div className='flex flex-col min-h-screen'>
      <Routes>
        <Route path='/' element={<Home></Home>}></Route>
        <Route path='/register' element={<Register></Register>}></Route>
        <Route path='/login' element={<Login></Login>}></Route>

        {/*Rutas protegidas*/}
        <Route element={<PrivateRoute><Outlet /></PrivateRoute>}>
          <Route path='/board' element={<Board />} />
          <Route path='/citas' element={<Citas />} />
          <Route path='/citas/nueva' element={<Nueva />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/resultados' element={<Resultados/>} />
          <Route path='/historial' element={<Historial/>}/>
        </Route>

      </Routes>
      <Footer></Footer>

    </div>


  )
}

export default App
