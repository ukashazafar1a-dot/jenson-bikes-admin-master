import React, { useEffect, useState,useContext } from 'react'
import { CRow,CCol,CCard,CCardHeader,CCardBody,CTable,CTableHead,CTableRow,CTableHeaderCell,CTableBody,CTableDataCell, CButton } from '@coreui/react'
import { CModal,CModalHeader,CModalTitle,CModalBody,CModalFooter } from '@coreui/react'
import {cilTrash, cilPen} from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
import { AppContext } from 'src/context/app/appContext'
import CIcon from '@coreui/icons-react'
import {DragDropContext,Droppable,Draggable} from 'react-beautiful-dnd'
import { changePackagePresetsRange, deletePackagePreset, getPackagePresets } from 'src/helpers/businessRequests'

function CVTable({presets,onRemove,onEdit, onView}){
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
                  <CTableHeaderCell scope="col">Length</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Width</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Height</CTableHeaderCell>
                  <CTableHeaderCell scope='col'>Weight</CTableHeaderCell>
                  <CTableHeaderCell scope='col'>isActive</CTableHeaderCell>
                </CTableRow>
            </CTableHead>
            <Droppable droppableId='package-presets'>
            {(provided)=>(
              <CTableBody {...provided.droppableProps} ref={provided.innerRef}>
                {presets?.map((preset,i)=>{
                  return (
                    <Draggable key={preset.id} draggableId={(preset.id).toString()} index={i}>
                      {(provided,snapshot)=>(
                    <CTableRow className={`align-middle ${snapshot.isDragging && 'dragging'}`} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} onClick={(e)=>onView(e,preset.id)}>
                        <CTableHeaderCell scope="row">{i+1}</CTableHeaderCell>
                        <CTableDataCell>{preset.name}</CTableDataCell>
                        <CTableDataCell>{preset.length} {preset.linearUnit}</CTableDataCell>
                        <CTableDataCell>{preset.width} {preset.linearUnit}</CTableDataCell>
                        <CTableDataCell>{preset.height} {preset.linearUnit}</CTableDataCell>
                        <CTableDataCell>{preset.weight} {preset.weightUnit}</CTableDataCell>
                        <CTableDataCell>{preset.isActive ? 'True' : 'False'}</CTableDataCell>
                        <CTableDataCell>
                          <CButton color="danger" style={{marginRight: '1rem'}} onClick={(e)=>handleRemove(e,preset.id)}>
                            <CIcon icon={cilTrash} />
                          </CButton>
                          <CButton color="info" onClick={(e)=>onEdit(e,preset.id)}>
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

function InsuranceOptions() {
    const {setNotification} = useContext(AppContext)
    const navigate = useNavigate()
    const [presets,setPresets] = useState([]);
    const handleAdd = function(){
        navigate('/package-presets/add')
    }

    async function handleRemove(id){
      try {
        await deletePackagePreset(id)
        let newPresets = presets.filter((op)=>op.id !== id)
        setPresets(newPresets)
        setNotification(false,"Preset removed Successfully!")
      } catch (error) {
        setNotification(true,error.message)
      }
    }

    function handleEdit(e,id){
      e.stopPropagation()
      navigate('/package-presets/edit/'+id)
    }

    function handleView(e,id){
      e.stopPropagation()
      navigate('/package-presets/view/'+id)
    }

    async function handleOnDragEnd(result){
      if(!result.destination) return;
      let items = Array.from(presets);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      items = items.map((item,i)=>{return {...item,sortOrder:i+1}})
      if(result.source.index != result.destination.index){
        setPresets(items);
        try {
          await changePackagePresetsRange(items)
          setNotification(false,'Order Updated!')
        } catch (error) {
          setNotification(true,error.message)
        }
      }
    }

    useEffect(()=>{
      async function loadPresets(){
        try {
          let {data} = await getPackagePresets()
          data.sort((a, b) => {return a.sortOrder - b.sortOrder;});
          setPresets(data)
        } catch (error) {
          setNotification(true,error.message)
        }
      }
      loadPresets()
    },[])
  return (
    <>
    <CRow>
    <CCol xs={12}>
      <CCard className="mb-4">
        <CCardHeader>
          <strong>Package</strong> <small>Presets</small>
          <CButton color='info' className='float-end' onClick={handleAdd}>Add New</CButton>
        </CCardHeader>
        <CCardBody>
          <DragDropContext onDragEnd={handleOnDragEnd}>
            {presets?.length > 0 && <CVTable presets={presets} onRemove={handleRemove} onEdit={handleEdit} onView={handleView}/>}
          </DragDropContext>
        </CCardBody>
      </CCard>
    </CCol>
    </CRow>
    </>
  )
}

export default InsuranceOptions