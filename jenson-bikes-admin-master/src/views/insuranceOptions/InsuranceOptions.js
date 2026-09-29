import React, { Component, useEffect, useState,useContext } from 'react'
import { CRow,CCol,CCard,CCardHeader,CCardBody,CTable,CTableHead,CTableRow,CTableHeaderCell,CTableBody,CTableDataCell, CButton } from '@coreui/react'
import { CModal,CModalHeader,CModalTitle,CModalBody,CModalFooter } from '@coreui/react'
import {cilTrash, cilPen} from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
import { AppContext } from 'src/context/app/appContext'
import CIcon from '@coreui/icons-react'
import { deleteInsuranceOption, getInsuranceOptions } from 'src/helpers/businessRequests'

function CVTable({options,onRemove,onEdit, onView}){
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
                  <CTableHeaderCell scope="col">Coverage</CTableHeaderCell>
                  <CTableHeaderCell scope='col'>Cost</CTableHeaderCell>
                  <CTableHeaderCell scope='col'>isActive</CTableHeaderCell>
                </CTableRow>
            </CTableHead>
              <CTableBody>
                {options?.map((option,i)=>{
                  return (
                    <CTableRow key={option.id} className={`align-middle`} onClick={(e)=>onView(e,option.id)}>
                        <CTableHeaderCell scope="row">{i+1}</CTableHeaderCell>
                        <CTableDataCell>{option.name}</CTableDataCell>
                        <CTableDataCell>{option.coverage} USD</CTableDataCell>
                        <CTableDataCell>{option.cost} USD</CTableDataCell>
                        <CTableDataCell>{option.isActive ? 'True' : 'False'}</CTableDataCell>
                        <CTableDataCell>
                          <CButton color="danger" style={{marginRight: '1rem'}} onClick={(e)=>handleRemove(e,option.id)}>
                            <CIcon icon={cilTrash} />
                          </CButton>
                          <CButton color="info" onClick={(e)=>onEdit(e,option.id)}>
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

function InsuranceOptions() {
    const {setNotification} = useContext(AppContext)
    const navigate = useNavigate()
    const [options,setOptions] = useState([]);
    const handleAdd = function(){
        navigate('/insurance-options/add')
    }

    async function handleRemove(id){
      try {
        await deleteInsuranceOption(id)
        let newOptions = options.filter((op)=>op.id !== id)
        setOptions(newOptions)
        setNotification(false,"Option removed Successfully!")
      } catch (error) {
        setNotification(true,error.message)
      }
    }

    function handleEdit(e,id){
      e.stopPropagation()
      navigate('/insurance-options/edit/'+id)
    }

    function handleView(e,id){
      e.stopPropagation()
      navigate('/insurance-options/view/'+id)
    }

    useEffect(()=>{
      async function loadOptions(){
        try {
          let {data} = await getInsuranceOptions() 
          setOptions(data)
        } catch (error) {
          setNotification(true,error.message)
        }
      }
      loadOptions()
    },[])
  return (
    <>
    <CRow>
    <CCol xs={12}>
      <CCard className="mb-4">
        <CCardHeader>
          <strong>Insurance</strong> <small>Options</small>
          <CButton color='info' className='float-end' onClick={handleAdd}>Add New</CButton>
        </CCardHeader>
        <CCardBody>
            {options?.length > 0 && <CVTable options={options} onRemove={handleRemove} onEdit={handleEdit} onView={handleView}/>}
        </CCardBody>
      </CCard>
    </CCol>
    </CRow>
    </>
  )
}

export default InsuranceOptions