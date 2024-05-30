
import { Routes, Route } from 'react-router-dom'
import { createContext, useState, useContext } from 'react'
import Home from './features/Home'
import Header from './features/Header'
import LoginRegister from './features/LoginRegister'
import Dashboard from './features/Dashboard'
import Auth from './auth/Auth'
import {AuthContextInterface, ProviderProps, UserResponse} from '../types/consts'
import './App.css'

export const AuthContext = createContext<AuthContextInterface | null>(null)


const AuthProvider = ({children}:ProviderProps) => {
  const [token, setToken] = useState<UserResponse | null>(null)

  return (
    <AuthContext.Provider value={{token, setToken}}>
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
        <div>
          <Header/>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/login' element={<LoginRegister page={'login'}/>}/>
            <Route path='/register' element={<LoginRegister page={'register'}/>}/>
            <Route path='/dashboard' element={<Auth><Dashboard/></Auth>}/>
          </Routes>
        </div>
      </AuthProvider>
    </>
  )
}

export default App
