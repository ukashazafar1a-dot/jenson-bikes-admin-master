import React, { useEffect, useState,useContext } from 'react'
import { CRow,CCol,CCard,CCardHeader,CCardBody, CButton } from '@coreui/react'
import { AppContext } from 'src/context/app/appContext'
import mernDashApi from 'src/helpers/apiUtils'
import EmailRecipents from './Components/EmailRecipents'


function Preferences() {
    const {setNotification} = useContext(AppContext)
    const [emailRecipents,setEmailRecipents]  = useState([])

    function handleUpdateEmails(){
        editEmails()
    }

    function editEmails(){
      try{
          let formData = new FormData()
          formData.append('emails',JSON.stringify(emailRecipents))
          mernDashApi.put('/api/preferences/update/email-recipents',formData,{
              headers: {
                  'Content-Type': 'application/json',
              }
          }).then((data)=>{
              setEmailRecipents(data.data.email_recipents)
              setNotification(false,'Updated Successfully!')
          }).catch((err)=>{
              console.log(err.data)
              setNotification(true,err.message)
          })
      }catch(err){
          setNotification(true, err.message)
      }
      // const res = await axios.post('/api/auth/login', data);
    }

    useEffect(()=>{
      mernDashApi.get('/api/preferences/email-recipents').then((data)=>{
        setEmailRecipents(data.data.email_recipents);
      }).catch((err)=>{
        setNotification(true,err.message)
      });
    },[])
  return (
    <>
    <CRow>
    <CCol xs={12}>
      <CCard className="mb-4">
        <CCardHeader>
          <strong>Email Recipents</strong>
        </CCardHeader>
        <CCardBody>
            <EmailRecipents value={emailRecipents} setValue={setEmailRecipents} />
            <CButton color='info' className='float-end' onClick={(e)=>handleUpdateEmails()}>Update</CButton>
        </CCardBody>
      </CCard>
    </CCol>
    </CRow>
    </>
  )
}

export default Preferences