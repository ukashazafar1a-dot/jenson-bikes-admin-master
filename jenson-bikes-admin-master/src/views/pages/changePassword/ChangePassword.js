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


const ChangePassword = () => {
  const { UpdatePasswordAction, state, AuthReset } = useContext(AuthContext);
  const { token, loading, error, errResponse } = state;
  const [validate,setValidate] = useState({
    state: false,
    message: ''
  })

  const [password,setPassword] = useState(null)
  const [newPassword, setNewPassword] = useState(null)

  const navigate = useNavigate()

  const validator = function(){
    if(!newPassword && !password){
      setValidate({state:true,message:'Please fill the credentials'})
      return false
    }else if(!newPassword){
      setValidate({state:true,message: 'New Password is missing!'})
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
      oldPassword: password,
      newPassword
    }
    const res = await UpdatePasswordAction(data);
    if(!res.status){
      setValidate({state:true,message: res.error_msg})
    }else{
        navigate('/user/login');
    }
  }

  useEffect(() => {
    AuthReset();
  }, []);

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
                    <h1 className='text-center'>Change Password</h1>
                    {validate.state && <CAlert color="danger">
                      {validate.message}
                    </CAlert>}
                    {error && <CAlert color='danger'>
                      {errResponse}
                      </CAlert>}
                    
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Old Password"
                        autoComplete="current-password" value={password} onChange={(e)=>setPassword(e.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="New Password"
                        autoComplete="new-password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" type='submit'>
                          Update
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default ChangePassword
