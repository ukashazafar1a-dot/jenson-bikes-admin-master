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
    const [products,setProducts]  = useState(null)
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(1);

    const handleAdd = function(){
        navigate('/store/products/add')
    }

    function changePage(page){
      mernDashApi.get(`/api/products/all?page=${page}`).then((data)=>{
        const {products, pagination} = data.data;
        setCurrentPage(pagination.currentPage);
        setTotalCount(pagination.count);
        setProducts(products);
      });
    }

    useEffect(()=>{
      mernDashApi.get('/api/products/all').then((data)=>{
        const {products, pagination} = data.data;
        setCurrentPage(pagination.currentPage);
        setTotalCount(pagination.count);
        setProducts(products);
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
                <strong>Products</strong>
                <CButton color='info' className='float-end' onClick={handleAdd}>Add New</CButton>
            </CCardHeader>
            <CCardBody>
                { products ? <div>
                  {products?.length > 0 && <Table items={products} currentPage={currentPage}/>}
                  {products?.length > 0 && <Pagination currentPage={currentPage} totalCount={totalCount} changePage={changePage}/>}
                </div> : <ContentLoader/> }
            </CCardBody>
        </CCard>
        </CCol>
        </CRow>
        </>
    )
}

export default All