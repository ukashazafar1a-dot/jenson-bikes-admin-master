import React, { useState,useContext, useEffect } from 'react'
import { CToaster,CToast,CToastBody,CToastClose } from '@coreui/react'
import { AppContext } from 'src/context/app/appContext'

function Notification() {
    const {state} = useContext(AppContext);
    const {notification} = state
    const [toast,setToast] = useState(null)
    const [delay,setDelay] = useState(2000)
    const successToast = (
        <CToast autohide={true} delay={delay} color='success' visible={true} className="align-items-center">
            <div className="d-flex text-white">
                <CToastBody >{notification?.message}</CToastBody>
                <CToastClose className="me-2 m-auto" color='secondary' />
            </div>
        </CToast>
    )
    const errorToast = (
        <CToast autohide={true} delay={delay} color='danger' visible={true} className="align-items-center">
            <div className="d-flex">
                <CToastBody >{notification?.message}</CToastBody>
                <CToastClose className="me-2 m-auto" />
            </div>
        </CToast>
    )
    useEffect(()=>{
        if(notification.message){
            if(notification.error){
                setToast(errorToast)
            }else{
                setToast(successToast)
            }
        }
    },[notification])
  return (
    <CToaster push={toast} placement="top-end" />
  )
}

export default Notification