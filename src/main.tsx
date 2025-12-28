import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { UserProvider } from './lib/user-context.tsx'
import { DoctorProvider } from './lib/doctor-context.tsx'


createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <UserProvider>
      <DoctorProvider>

        <App>

        </App>

      </DoctorProvider>


    </UserProvider>
  </BrowserRouter>
)
