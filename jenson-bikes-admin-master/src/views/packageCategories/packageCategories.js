import React, { useEffect, useState,useContext } from 'react'
import { CRow,CCol,CCard,CCardHeader,CCardBody,CTable,CTableHead,CTableRow,CTableHeaderCell,CTableBody,CTableDataCell, CButton } from '@coreui/react'
import { CModal,CModalHeader,CModalTitle,CModalFooter } from '@coreui/react'
import {cilTrash, cilPen} from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
import { AppContext } from 'src/context/app/appContext'
import mernDashApi from 'src/helpers/apiUtils'
import CIcon from '@coreui/icons-react'
import { packageCategories } from 'src/assets/data'
import {DragDropContext,Droppable,Draggable} from 'react-beautiful-dnd'
import { changePackageCategoriesRange, deletePackageCategory, getPackageCategories } from 'src/helpers/businessRequests'

function CVTable({categories,onRemove,onEdit, onView}){
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
                  <CTableHeaderCell scope="col">code</CTableHeaderCell>
                  <CTableHeaderCell scope='col'>isActive</CTableHeaderCell>
                </CTableRow>
            </CTableHead>
            <Droppable droppableId='package-categories'>
            {(provided)=>(
              <CTableBody {...provided.droppableProps} ref={provided.innerRef}>
                {categories?.map((category,i)=>{
                  return (
                    <Draggable key={category.id} draggableId={(category.id).toString()} index={i}>
                      {(provided,snapshot)=>(
                    <CTableRow className={`align-middle ${snapshot.isDragging && 'dragging'}`} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} onClick={(e)=>onView(e,category.id)}>
                        <CTableHeaderCell scope="row">{i+1}</CTableHeaderCell>
                        <CTableDataCell>{category.name}</CTableDataCell>
                        <CTableDataCell>{category.code}</CTableDataCell>
                        <CTableDataCell>{category.isActive ? 'True' : 'False'}</CTableDataCell>
                        <CTableDataCell>
                          <CButton color="danger" style={{marginRight: '1rem'}} onClick={(e)=>handleRemove(e,category.id)}>
                            <CIcon icon={cilTrash} />
                          </CButton>
                          <CButton color="info" onClick={(e)=>onEdit(e,category.id)}>
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

function PackageCategories() {
    const {setNotification} = useContext(AppContext)
    const navigate = useNavigate()
    const [categories,setCategories] = useState([]);
    const handleAdd = function(){
        navigate('/package-categories/add')
    }

    async function handleRemove(id){
      try {
        await deletePackageCategory(id)
        let newCategories = categories.filter((op)=>op.id !== id)
        setCategories(newCategories)
        setNotification(false,"Category removed Successfully!")
      } catch (error) {
        setNotification(true,error.message)
      }
    }

    function handleEdit(e,id){
      e.stopPropagation()
      navigate('/package-categories/edit/'+id)
    }

    function handleView(e,id){
      e.stopPropagation()
      navigate('/package-categories/view/'+id)
    }

    async function handleOnDragEnd(result){
      if(!result.destination) return;
      let items = Array.from(categories);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      items = items.map((item,i)=>{return {...item,sortOrder:i+1}})
      if(result.source.index != result.destination.index){
        setCategories(items);
        try {
          await changePackageCategoriesRange(items)
          setNotification(false,'Order Updated!')
        } catch (error) {
          setNotification(true,error.message)
        }
      }
    }

    useEffect(()=>{
      async function loadCategories(){
        try {
          let {data} = await getPackageCategories()
          data.sort((a, b) => {return a.sortOrder - b.sortOrder;});
          console.log(data)
          setCategories(data)
        } catch (error) {
          setNotification(true,error.message)
        }
      }
      loadCategories()
    },[])
  return (
    <>
    <CRow>
    <CCol xs={12}>
      <CCard className="mb-4">
        <CCardHeader>
          <strong>Package</strong> <small>Categories</small>
          <CButton color='info' className='float-end' onClick={handleAdd}>Add New</CButton>
        </CCardHeader>
        <CCardBody>
          <DragDropContext onDragEnd={handleOnDragEnd}>
            {categories?.length > 0 && <CVTable categories={categories} onRemove={handleRemove} onEdit={handleEdit} onView={handleView}/>}
          </DragDropContext>
        </CCardBody>
      </CCard>
    </CCol>
    </CRow>
    </>
  )
}

export default PackageCategories