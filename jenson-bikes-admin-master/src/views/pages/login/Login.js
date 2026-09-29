import React, { useState,useContext,useEffect } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { AuthContext } from 'src/context/auth/AuthContext'
import checkAdminAuth from 'src/helpers/AdminAuth'


const Login = () => {
  const { LoginAction, state, AuthReset } = useContext(AuthContext);
  const { token, loading, error, errResponse } = state;
  const [validate,setValidate] = useState({
    state: false,
    message: ''
  })
  const [email,setEmail] = useState(null)
  const [password,setPassword] = useState(null)

  const navigate = useNavigate()

  const validator = function(){
    if(!email && !password){
      setValidate({state:true,message:'Please fill the credentials'})
      return false
    }else if(!email){
      setValidate({state:true,message: 'Email is missing!'})
      return false
    }else if(!password){
      setValidate({state:true,message: 'Password is missing'})
      return false
    }else{
      setValidate({state:false,message: ''})
      return true
    }
  }

  const submitHandler = async function(e){
    e.preventDefault()
    if(!validator()) return;
    let data = {
      email,
      password
    }
    const res = await LoginAction(data);
    if(!res.status){
      setValidate({state:true,message: res.error_msg})
    }
    console.log("On submits")
  }

  useEffect(() => {
    AuthReset();
  }, []);

  useEffect(() => {
    checkAdminAuth(token);
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);

  useEffect(() => {
    if (error) {
      setValidate({state:false,message: errResponse})
    }
  }, [error, errResponse]);

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={submitHandler}>
                    <h1>Login</h1>
                    <p className="text-medium-emphasis">Sign In to your account</p>
                    {validate.state && <CAlert color="danger">
                      {validate.message}
                    </CAlert>}
                    {error && <CAlert color='danger'>
                      {errResponse}
                      </CAlert>}
                    
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput type='email' placeholder="Email" autoComplete="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password" value={password} onChange={(e)=>setPassword(e.target.value)}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" type='submit'>
                          Login
                        </CButton>
                      </CCol>
                      {/* <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol> */}
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              {/* <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard> */}
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
