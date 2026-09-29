import React, { useState } from 'react'
import { CTable,CTableHead,CTableRow,CTableHeaderCell,CTableBody,CTableDataCell, CButton, CBadge } from '@coreui/react'
import { CModal,CModalHeader,CModalTitle,CModalBody,CModalFooter } from '@coreui/react'

import { useNavigate } from 'react-router-dom'

function Table({items}) {
    const navigate = useNavigate();
    const [idToRemove, setIdToRemove] = useState(null);


    function handleView(id){
      navigate('/navigations/view/'+id)
    }

    function renderMenuItems(item){
      return item?.children?.map((child,i)=>{
        if(i === 0) return child.title
        return ' , ' + child.title
      })
    }

    return (
      <>
        <CTable hover>
            <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Title</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Menu Items</CTableHeaderCell>
                </CTableRow>
            </CTableHead>
            <CTableBody>
              {items?.map((item,i)=>{
                return (
                  <CTableRow className="align-middle" key={item._id} style={{cursor: 'pointer'}} onClick={()=>handleView(item._id)}>
                      <CTableHeaderCell scope="row">{i+1}</CTableHeaderCell>
                      <CTableDataCell>{item?.title}</CTableDataCell>
                      <CTableDataCell>{renderMenuItems(item)}</CTableDataCell>
                  </CTableRow>
                )
              })}
            </CTableBody>
        </CTable>
      </>
    )
}

export default Table