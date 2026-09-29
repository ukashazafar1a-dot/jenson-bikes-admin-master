import React, { useEffect, useState,useContext } from 'react'
import { CRow,CCol,CCard,CCardHeader,CCardBody,CTable,CTableHead,CTableRow,CTableHeaderCell,CTableBody,CTableDataCell, CButton } from '@coreui/react'
import { CModal,CModalHeader,CModalTitle,CModalBody,CModalFooter } from '@coreui/react'
import mernDashApi from 'src/helpers/apiUtils'
import { AppContext } from 'src/context/app/appContext'
import { useNavigate } from 'react-router-dom'
import Pagination from 'src/components/Pagination'

function CVTable({orders,currentPage}){
    const navigate = useNavigate();
    const [visible,setVisible] = useState(false)

    function handleView(id){
      navigate('/orders/photoPrintings/'+id)
    }

    function onConfirm(){
      setVisible(false)
    }

    const CustomModal = (
      // <CButton onClick={() => setVisible(!visible)}>Launch demo modal</CButton>
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader onClose={() => setVisible(false)}>
          <CModalTitle>Are you Sure!</CModalTitle>
        </CModalHeader>
        <CModalFooter className='justify-content-center'>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
          <CButton color="danger" onClick={(e)=>onConfirm()}>Delete</CButton>
        </CModalFooter>
      </CModal>
    )

    return (
      <>
        {CustomModal}
        <CTable hover>
            <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Price</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                </CTableRow>
            </CTableHead>
            <CTableBody>
              {orders?.map((order,i)=>{
                return (
                  <CTableRow className="align-middle" key={order._id} style={{cursor: 'pointer'}} onClick={()=>handleView(order._id)}>
                      <CTableHeaderCell scope="row">{((currentPage * 40) - 40) + i+1}</CTableHeaderCell>
                      <CTableDataCell>{order?.firstname + ' ' + order?.lastname}</CTableDataCell>
                      <CTableDataCell>{order?.email}</CTableDataCell>
                      <CTableDataCell>{order?.status}</CTableDataCell>
                      <CTableDataCell>{order?.price + ' AED'}</CTableDataCell>
                      <CTableDataCell>{order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}</CTableDataCell>
                  </CTableRow>
                )
              })}
            </CTableBody>
        </CTable>
      </>
    )
    }

function PhotoPrintings() {
    const {setNotification} = useContext(AppContext)
    const [orders,setOrders]  = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(1);

    function changePage(page){
      mernDashApi.get(`/api/orders/photoPrintOrders?page=${page}`).then((data)=>{
        console.log("Data",data.data);
        const {orders, pagination} = data.data;
        setCurrentPage(pagination.currentPage);
        setTotalCount(pagination.count);
        setOrders(orders);
      });
    }

    useEffect(()=>{
      mernDashApi.get('/api/orders/photoPrintOrders').then((data)=>{
        console.log("Data",data.data);
        const {orders, pagination} = data.data;
        setCurrentPage(pagination.currentPage);
        setTotalCount(pagination.count);
        setOrders(orders);
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
          <strong>Photo Printing Orders</strong>
        </CCardHeader>
        <CCardBody>
            {orders?.length > 0 && <CVTable orders={orders} currentPage={currentPage}/>}
            {orders?.length > 0 && <Pagination currentPage={currentPage} totalCount={totalCount} changePage={changePage}/>}
        </CCardBody>
      </CCard>
    </CCol>
    </CRow>
    </>
  )
}

export default PhotoPrintings