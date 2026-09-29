import React, { Component, useEffect, useState,useContext } from 'react'
import { CRow,CCol,CCard,CCardHeader,CCardBody,CTable,CTableHead,CTableRow,CTableHeaderCell,CTableBody,CTableDataCell, CButton } from '@coreui/react'
import { CModal,CModalHeader,CModalTitle,CModalBody,CModalFooter } from '@coreui/react'
import {cilTrash, cilPen} from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
import { AppContext } from 'src/context/app/appContext'
import mernDashApi from 'src/helpers/apiUtils'
import CIcon from '@coreui/icons-react'

function CVTable({templates,onRemove,onEdit, onView}){
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
                  <CTableHeaderCell scope="col">Image</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                  <CTableHeaderCell scope='col'>Price</CTableHeaderCell>
                  <CTableHeaderCell scope='col'>Actions</CTableHeaderCell>
                </CTableRow>
            </CTableHead>
            <CTableBody>
              {templates?.map((template,i)=>{
                return (
                  <CTableRow className="align-middle" key={template._id} onClick={(e)=>onView(e,template._id)}>
                      <CTableHeaderCell scope="row">{i+1}</CTableHeaderCell>
                      <CTableDataCell className='w-50'><img src={template.preview[0]?.path} className="w-25 rounded-4" /></CTableDataCell>
                      <CTableDataCell>{template.isPaid ? 'Paid' : 'Free'}</CTableDataCell>
                      <CTableDataCell>{template.price} AED</CTableDataCell>
                      <CTableDataCell>
                        <CButton color="danger" style={{marginRight: '1rem'}} onClick={(e)=>handleRemove(e,template._id)}>
                          <CIcon icon={cilTrash} />
                        </CButton>
                        <CButton color="info" onClick={(e)=>onEdit(e,template._id)}>
                          <CIcon icon={cilPen} />
                        </CButton>
                      </CTableDataCell>
                  </CTableRow>
                )
              })}
            </CTableBody>
        </CTable>
      </>
    )
    }

function CVTemplates() {
    const {setNotification} = useContext(AppContext)
    const navigate = useNavigate()
    const [templates,setTemplates] = useState([]);
    const handleAdd = function(){
        navigate('/cv-templates/add')
    }

    function handleRemove(id){
      mernDashApi.get('/api/cvtemplates/delete/'+id).then((data)=>{
          setTemplates(data.data.templates);
          setNotification(false,"Template removed Successfully!")
        }).catch((err)=>{
          setNotification(true,err.message)
        })
        console.log("Id",id)
    }

    function handleEdit(e,id){
      e.stopPropagation()
      navigate('/cv-templates/edit/'+id)
    }

    function handleView(e,id){
      e.stopPropagation()
      navigate('/cv-templates/view/'+id)
    }

    useEffect(()=>{
      mernDashApi.get('/api/cvtemplates/all').then((data)=>{
        console.log("Data",data.data.templates);
        setTemplates(data.data.templates);
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
          <strong>CV</strong> <small>Templates</small>
          <CButton color='info' className='float-end' onClick={handleAdd}>Add New</CButton>
        </CCardHeader>
        <CCardBody>
            {templates?.length > 0 && <CVTable templates={templates} onRemove={handleRemove} onEdit={handleEdit} onView={handleView}/>}
        </CCardBody>
      </CCard>
    </CCol>
    </CRow>
    </>
  )
}

export default CVTemplates