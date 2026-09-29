import React, { useEffect,useContext, useState } from 'react'
import { CRow,CCol,CCard,CCardHeader,CCardBody,CTable,CTableHead,CTableRow,CTableHeaderCell,CTableBody,CTableDataCell, CButton } from '@coreui/react'
import { AppContext } from 'src/context/app/appContext'
import { getOrders } from 'src/helpers/businessRequests'
import moment from 'moment'

function CVTable({orders}){

  return (
    <>
      <CTable hover>
          <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">Order ID</CTableHeaderCell>
                <CTableHeaderCell scope="col">Payment Status</CTableHeaderCell>
                <CTableHeaderCell scope="col">Total Bill</CTableHeaderCell>
                <CTableHeaderCell scope='col'>Date</CTableHeaderCell>
              </CTableRow>
          </CTableHead>
            <CTableBody>
              {orders?.map((order,i)=>{
                return (
                  <CTableRow key={order.id} className={`align-middle`}>
                      <CTableHeaderCell scope="row">{i+1}</CTableHeaderCell>
                      <CTableDataCell>{order.paymentStatus}</CTableDataCell>
                      <CTableDataCell>{order.totalBill}$</CTableDataCell>
                      <CTableDataCell>{moment(order.dateTime).format("MMM Do YY")}</CTableDataCell>
                  </CTableRow>
                )
              })}
            </CTableBody>
      </CTable>
    </>
  )
}

function Orders() {
    const {setNotification} = useContext(AppContext)
    const [orders,setOrders] = useState([])

    async function getData(){
      try {
        const {data} = await getOrders()
        setOrders(data)
      } catch (error) {
        console.log("Error",error)
        setNotification(true,error.message)
      }
      

    }

    useEffect(()=>{

      // getOrders().then((data)=>{
      //   console.log("Data",data);
      //   setTemplates(data.data.templates);
      // }).catch((err)=>{
        
      // });
      // mernDashApi.get('/api/orders/documentPringintOrders').then((data)=>{
      //   console.log("Document orders", data);
      // })
      getData()
    },[])

  return (
    <>
    <CRow>
    <CCol xs={12}>
      <CCard className="mb-4">
        <CCardHeader>
          <small>Orders</small>
          {/* <CButton color='info' className='float-end'>Add New</CButton> */}
        </CCardHeader>
        <CCardBody>
        {orders?.length > 0 && <CVTable orders={orders}/>}
        </CCardBody>
      </CCard>
    </CCol>
    </CRow>
    </>
  )
}

export default Orders