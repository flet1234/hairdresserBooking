
import { Routes, Route } from 'react-router-dom'
import { createContext, useState, useContext } from 'react'
import Home from './features/Home'
import Header from './features/Header'
import LoginRegister from './features/LoginRegister'
import Auth from './auth/Auth'
import {AuthContextInterface, ProviderProps, UserResponse} from '../types/consts'
// import './App.css'
import CheckAdmin from './auth/CheckAdmin'
import AdminBoard from './features/AdminBoard'
import Success from './features/Success'

export const AuthContext = createContext<AuthContextInterface | null>(null)


const AuthProvider = ({children}:ProviderProps) => {
  const [token, setToken] = useState<UserResponse | null>(null)
  const [admin, setAdmin] = useState<boolean>(false)

  return (
    <AuthContext.Provider value={{token, setToken,admin,setAdmin}}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = (): AuthContextInterface => {
  const context = useContext(AuthContext);
  if (!context) {
      throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

function App() {
  
  return (
    <>
      <AuthProvider>
          <CheckAdmin>
          <Header/>
          <Routes>
            <Route path='/' element={<Auth><CheckAdmin><Home/></CheckAdmin></Auth>}/>
            <Route path='/login' element={<LoginRegister page={'login'}/>}/>
            <Route path='/register' element={<LoginRegister page={'register'}/>}/>
            <Route path='/dashboard' element={<Auth><Success/></Auth>}/>
            <Route path='/admindashboard' element={<Auth><AdminBoard/></Auth>}/>
          </Routes>
          </CheckAdmin>
      </AuthProvider>
    </>
  )
}

export default App
