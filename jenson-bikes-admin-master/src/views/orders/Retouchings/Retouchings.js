import React, { useEffect, useState,useContext } from 'react'
import { CRow,CCol,CCard,CCardHeader,CCardBody,CTable,CTableHead,CTableRow,CTableHeaderCell,CTableBody,CTableDataCell, CButton } from '@coreui/react'
import { CModal,CModalHeader,CModalTitle,CModalBody,CModalFooter } from '@coreui/react'
import {cilTrash, cilPen} from '@coreui/icons'
import mernDashApi from 'src/helpers/apiUtils'
import { AppContext } from 'src/context/app/appContext'
import CIcon from '@coreui/icons-react'
import { useNavigate } from 'react-router-dom'

function CVTable({orders}){
    const navigate = useNavigate();
    const [visible,setVisible] = useState(false)
    const [idToRemove, setIdToRemove] = useState(null);

    function handleRemove(id){
      setIdToRemove(id);
      setVisible(true);
    }

    function handleView(id){
      navigate('/orders/retouchings/'+id)
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
                      <CTableHeaderCell scope="row">{i+1}</CTableHeaderCell>
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

function Retouchings() {
    const {setNotification} = useContext(AppContext)
    const [orders,setOrders]  = useState([])

    useEffect(()=>{
      mernDashApi.get('/api/orders/retouchingOrders').then((data)=>{
        console.log("Data",data.data.orders);
        setOrders(data.data.orders);
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
          <strong>Retouchings</strong>
        </CCardHeader>
        <CCardBody>
            {orders?.length > 0 && <CVTable orders={orders} />}
        </CCardBody>
      </CCard>
    </CCol>
    </CRow>
    </>
  )
}

export default Retouchings