import React, { Component, Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes,useNavigate } from 'react-router-dom'
import $ from 'jquery'
import checkAdminAuth from './helpers/AdminAuth'
import './scss/style.scss'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
// const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

  export const PrivateAdminRoute = ({ children }) => {
    const navigate = useNavigate()
    useEffect(()=>{
      console.log("Auth is",checkAdminAuth())
      if(!checkAdminAuth()){
        navigate('/user/login')
      }
    },[])

    return (
      <>
        {children}
      </>
    )
  }

class App extends Component {
  constructor(props){
    super(props)
    window.$ = window.jQuery = $
  }
  render() {
    return (
          <Routes>
            <Route exact path="*" name="Home" element={
              <PrivateAdminRoute>
                <DefaultLayout/>
              </PrivateAdminRoute>
            } />
            {/* <Route exact path="/user/login" name="Login" element={<Login />} /> */}
            <Route exact path="/register" name="Register Page" element={<Register />} />
            <Route exact path="/404" name="Page 404" element={<Page404 />} />
            <Route exact path="/500" name="Page 500" element={<Page500 />} />
          </Routes>
    )
  }
}

export default App
