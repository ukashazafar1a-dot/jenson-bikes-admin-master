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
    const [pages,setPages]  = useState(null)
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(1);

    const handleAdd = function(){
        navigate('/store/pages/add')
    }

    function changePage(page){
      mernDashApi.get(`/api/pages/all?page=${page}`).then((data)=>{
        const {pages, pagination} = data.data;
        setCurrentPage(pagination.currentPage);
        setTotalCount(pagination.count);
        setPages(pages);
      });
    }

    useEffect(()=>{
      mernDashApi.get('/api/pages/all').then((data)=>{
        const {pages, pagination} = data.data;
        setCurrentPage(pagination.currentPage);
        setTotalCount(pagination.count);
        setPages(pages);
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
                <strong>Pages</strong>
                <CButton color='info' className='float-end' onClick={handleAdd}>Add New</CButton>
            </CCardHeader>
            <CCardBody>
                { pages ? <div>
                  {pages?.length > 0 && <Table items={pages} currentPage={1}/>}
                  {pages?.length > 0 && <Pagination currentPage={currentPage} totalCount={totalCount} changePage={changePage}/>}
                </div> : <ContentLoader/> }
            </CCardBody>
        </CCard>
        </CCol>
        </CRow>
        </>
    )
}

export default All