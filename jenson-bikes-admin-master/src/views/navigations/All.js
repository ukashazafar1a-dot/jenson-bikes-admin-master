import React, { useEffect, useState,useContext } from 'react'
import mernDashApi from 'src/helpers/apiUtils'
import { AppContext } from 'src/context/app/appContext'
import {CRow,CCol,CCard,CCardHeader,CCardBody,CButton} from '@coreui/react'
import Table from './Components/Table'
import { useNavigate } from 'react-router-dom'
import ContentLoader from 'src/components/Loaders/ContentLoader'

function All() {
    const navigate = useNavigate()
    const {setNotification} = useContext(AppContext)
    const [navigations,setNavigations]  = useState(null)

    const handleAdd = function(){
        navigate('/navigations/add')
    }

    useEffect(()=>{
      mernDashApi.get('/api/navigations/all').then((data)=>{
        const {navigations} = data.data;
        setNavigations(navigations);
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
                <strong>Navigations</strong>
                <CButton color='info' className='float-end' onClick={handleAdd}>Add New</CButton>
            </CCardHeader>
            <CCardBody>
                { navigations ? <div>
                  {navigations?.length > 0 && <Table items={navigations}/>}
                </div> : <ContentLoader/> }
            </CCardBody>
        </CCard>
        </CCol>
        </CRow>
        </>
    )
}

export default All