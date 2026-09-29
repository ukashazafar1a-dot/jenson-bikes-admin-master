import React, { Component, useEffect, useState,useContext } from 'react'
import { CRow,CCol,CCard,CCardHeader,CCardBody,CTable,CTableHead,CTableRow,CTableHeaderCell,CTableBody,CTableDataCell, CButton } from '@coreui/react'
import { CModal,CModalHeader,CModalTitle,CModalBody,CModalFooter } from '@coreui/react'
import {cilTrash, cilPen} from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
import { AppContext } from 'src/context/app/appContext'
import mernDashApi from 'src/helpers/apiUtils'
import CIcon from '@coreui/icons-react'
import { packagePurposes } from 'src/assets/data'
import {DragDropContext,Droppable,Draggable} from 'react-beautiful-dnd'

function CVTable({purposes,onRemove,onEdit, onView}){
    const [visible,setVisible] = useState(false)
    const [idToRemove, setIdToRemove] = useState(null);

    function handleRemove(e,id){
      e.stopPropagation()
      setIdToRemove(id);
      setVisible(true);
    }

    function onConfirm(){
      setVisible(false)
      onRemove(idToRemove)
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
                  <CTableHeaderCell scope="col">Code</CTableHeaderCell>
                  <CTableHeaderCell scope='col'>isActive</CTableHeaderCell>
                </CTableRow>
            </CTableHead>
            <Droppable droppableId='package-purposes'>
            {(provided)=>(
              <CTableBody {...provided.droppableProps} ref={provided.innerRef}>
                {purposes?.map((purpose,i)=>{
                  return (
                    <Draggable key={purpose.id} draggableId={(purpose.id).toString()} index={i}>
                      {(provided,snapshot)=>(
                    <CTableRow className={`align-middle ${snapshot.isDragging && 'dragging'}`} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} onClick={(e)=>onView(e,purpose.id)}>
                        <CTableHeaderCell scope="row">{i+1}</CTableHeaderCell>
                        <CTableDataCell>{purpose.name}</CTableDataCell>
                        <CTableDataCell>{purpose.code}</CTableDataCell>
                        <CTableDataCell>{purpose.isActive ? 'True' : 'False'}</CTableDataCell>
                        <CTableDataCell>
                          <CButton color="danger" style={{marginRight: '1rem'}} onClick={(e)=>handleRemove(e,purpose.id)}>
                            <CIcon icon={cilTrash} />
                          </CButton>
                          <CButton color="info" onClick={(e)=>onEdit(e,purpose.id)}>
                            <CIcon icon={cilPen} />
                          </CButton>
                        </CTableDataCell>
                    </CTableRow>
                    )}
                    </Draggable>
                  )
                })}
                {provided.placeholder}
              </CTableBody>
            )}
            </Droppable>
        </CTable>
      </>
    )
}

function PackagePurposes() {
    const {setNotification} = useContext(AppContext)
    const navigate = useNavigate()
    const [purposes,setPurposes] = useState([]);
    const handleAdd = function(){
        navigate('/package-purposes/add')
    }

    function handleRemove(id){
      mernDashApi.get('/api/cvtemplates/delete/'+id).then((data)=>{
          setPurposes(data.data.templates);
          setNotification(false,"Template removed Successfully!")
        }).catch((err)=>{
          setNotification(true,err.message)
        })
    }

    function handleEdit(e,id){
      e.stopPropagation()
      navigate('/package-purposes/edit/'+id)
    }

    function handleView(e,id){
      e.stopPropagation()
      navigate('/package-purposes/view/'+id)
    }

    function handleOnDragEnd(result){
      if(!result.destination) return;
      const items = Array.from(purposes);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);

      setPurposes(items);
    }

    useEffect(()=>{
      // mernDashApi.get('/api/insurance-options/all').then((data)=>{
      //   setOptions(data.data.templates);
      // }).catch((err)=>{
      //   setNotification(true,err.message)
      // });
      setPurposes(packagePurposes)
    },[])
  return (
    <>
    <CRow>
    <CCol xs={12}>
      <CCard className="mb-4">
        <CCardHeader>
          <strong>Package</strong> <small>Purposes</small>
          <CButton color='info' className='float-end' onClick={handleAdd}>Add New</CButton>
        </CCardHeader>
        <CCardBody>
          <DragDropContext onDragEnd={handleOnDragEnd}>
            {purposes?.length > 0 && <CVTable purposes={purposes} onRemove={handleRemove} onEdit={handleEdit} onView={handleView}/>}
          </DragDropContext>
        </CCardBody>
      </CCard>
    </CCol>
    </CRow>
    </>
  )
}

export default PackagePurposes