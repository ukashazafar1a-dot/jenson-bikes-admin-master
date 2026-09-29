import React, { useState } from 'react'
import { CTable,CTableHead,CTableRow,CTableHeaderCell,CTableBody,CTableDataCell, CButton, CBadge } from '@coreui/react'
import { CModal,CModalHeader,CModalTitle,CModalFooter } from '@coreui/react'
import { useNavigate } from 'react-router-dom'

function Table({items, currentPage}) {
    const navigate = useNavigate();
    const [visible,setVisible] = useState(false)

    function handleView(id){
      navigate('/store/products/view/'+id)
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
                  <CTableHeaderCell scope="col">Title</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Inventory</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Type</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Vendor</CTableHeaderCell>
                </CTableRow>
            </CTableHead>
            <CTableBody>
              {items?.map((product,i)=>{
                return (
                  <CTableRow className="align-middle" key={product._id} style={{cursor: 'pointer'}} onClick={()=>handleView(product._id)}>
                      <CTableHeaderCell scope="row">{((currentPage * 40) - 40) + i+1}</CTableHeaderCell>
                      <CTableDataCell>{product?.title}</CTableDataCell>
                      <CTableDataCell>{product?.isActive ? <CBadge color='primary'>Active</CBadge> : <CBadge color='secondary'>Draft</CBadge>}</CTableDataCell>
                      <CTableDataCell>{product?.quantity}{' in stock'}</CTableDataCell>
                      <CTableDataCell>{product?.type ? product.type : '-'}</CTableDataCell>
                      <CTableDataCell>{product?.vendor ? product.vendor : '-'}</CTableDataCell>
                  </CTableRow>
                )
              })}
            </CTableBody>
        </CTable>
      </>
    )
}

export default Table