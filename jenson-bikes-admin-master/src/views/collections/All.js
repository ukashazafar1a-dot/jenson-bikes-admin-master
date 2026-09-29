import React, { useEffect, useState,useContext } from 'react'
import mernDashApi from 'src/helpers/apiUtils'
import { AppContext } from 'src/context/app/appContext'
import Pagination from 'src/components/Pagination'
import {CRow,CCol,CCard,CCardHeader,CCardBody,CButton} from '@coreui/react'
import Table from './Components/Table'
import { useNavigate } from 'react-router-dom'
import ContentLoader from 'src/components/Loaders/ContentLoader'

function All() {
    const navigate = useNavigate()
    const {setNotification} = useContext(AppContext)
    const [collections,setCollections]  = useState(null)
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(1);

    const handleAdd = function(){
        navigate('/store/collections/add')
    }

    function changePage(page){
      mernDashApi.get(`/api/collections/all?page=${page}`).then((data)=>{
        const {collections, pagination} = data.data;
        setCurrentPage(pagination.currentPage);
        setTotalCount(pagination.count);
        setCollections(collections);
      });
    }

    useEffect(()=>{
      mernDashApi.get('/api/collections/all').then((data)=>{
        const {collections, pagination} = data.data;
        setCurrentPage(pagination.currentPage);
        setTotalCount(pagination.count);
        setCollections(collections);
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
                <strong>Collections</strong>
                <CButton color='info' className='float-end' onClick={handleAdd}>Add New</CButton>
            </CCardHeader>
            <CCardBody>
                { collections ? <div>
                  {collections?.length > 0 && <Table items={collections} currentPage={1}/>}
                  {collections?.length > 0 && <Pagination currentPage={currentPage} totalCount={totalCount} changePage={changePage}/>}
                </div> : <ContentLoader/> }
            </CCardBody>
        </CCard>
        </CCol>
        </CRow>
        </>
    )
}

export default All