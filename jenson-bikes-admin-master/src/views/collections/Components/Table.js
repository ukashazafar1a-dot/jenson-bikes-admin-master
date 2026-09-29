import React, { useState } from 'react'
import { CTable,CTableHead,CTableRow,CTableHeaderCell,CTableBody,CTableDataCell, CButton } from '@coreui/react'
import { CModal,CModalHeader,CModalTitle,CModalBody,CModalFooter } from '@coreui/react'
import {cilTrash, cilPen} from '@coreui/icons'

import CIcon from '@coreui/icons-react'
import { useNavigate } from 'react-router-dom'

function Table({items, currentPage}) {
    const navigate = useNavigate();
    const [visible,setVisible] = useState(false)
    const [idToRemove, setIdToRemove] = useState(null);

    function handleRemove(id){
      setIdToRemove(id);
      setVisible(true);
    }

    function handleView(id){
      navigate('/store/collections/view/'+id)
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
                  <CTableHeaderCell scope="col">Products</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                </CTableRow>
            </CTableHead>
            <CTableBody>
              {items?.map((collection,i)=>{
                return (
                  <CTableRow className="align-middle" key={collection._id} style={{cursor: 'pointer'}} onClick={()=>handleView(collection._id)}>
                      <CTableHeaderCell scope="row">{((currentPage * 40) - 40) + i+1}</CTableHeaderCell>
                      <CTableDataCell>{collection?.title}</CTableDataCell>
                      <CTableDataCell>{collection?.products?.length}</CTableDataCell>
                      <CTableDataCell>{collection?.isActive ? 'Active' : 'Draft'}</CTableDataCell>
                      <CTableDataCell>
                        {/* <CButton color="danger" style={{marginRight: '1rem'}} onClick={(e)=>handleRemove(area._id)}>
                          <CIcon icon={cilTrash} />
                        </CButton> */}
                        {/* <CButton color="info" onClick={(e)=>onEdit(collection._id)}>
                          <CIcon icon={cilPen} />
                        </CButton> */}
                      </CTableDataCell>
                  </CTableRow>
                )
              })}
            </CTableBody>
        </CTable>
      </>
    )
}

export default Table