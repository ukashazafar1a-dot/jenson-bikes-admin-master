import React, { useEffect, useState,useContext } from 'react'
import { CRow,CCol,CCard,CCardHeader,CCardBody,CTable,CTableHead,CTableRow,CTableHeaderCell,CTableBody,CTableDataCell, CButton } from '@coreui/react'
import { CModal,CModalHeader,CModalTitle,CModalBody,CModalFooter } from '@coreui/react'
import {cilTrash, cilPen} from '@coreui/icons'
import mernDashApi from 'src/helpers/apiUtils'
import { AppContext } from 'src/context/app/appContext'
import AddModal from './AddModal'
import EditModal from './EditModal'
import CIcon from '@coreui/icons-react'

function CVTable({areas,onRemove,onEdit}){
    const [visible,setVisible] = useState(false)
    const [idToRemove, setIdToRemove] = useState(null);

    function handleRemove(id){
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
                  <CTableHeaderCell scope="col">AreaSet</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                </CTableRow>
            </CTableHead>
            <CTableBody>
              {areas?.map((area,i)=>{
                return (
                  <CTableRow className="align-middle" key={area._id}>
                      <CTableHeaderCell scope="row">{i+1}</CTableHeaderCell>
                      <CTableDataCell>{area.name}</CTableDataCell>
                      <CTableDataCell>{area.areaset}</CTableDataCell>
                      <CTableDataCell>
                        <CButton color="danger" style={{marginRight: '1rem'}} onClick={(e)=>handleRemove(area._id)}>
                          <CIcon icon={cilTrash} />
                        </CButton>
                        <CButton color="info" onClick={(e)=>onEdit(area._id)}>
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

function Areas() {
    const {setNotification} = useContext(AppContext)
    const [showAdd,setShowAdd] = useState(false)
    const [showEdit, setShowEdit] = useState(false)
    const [areaToEdit, setAreaToEdit] = useState({})
    const [areas,setAreas]  = useState([])

    function handleAdd(name,areaset){
        try{
            let formData = new FormData()
            formData.append('name',name);
            formData.append('areaset',areaset);
            mernDashApi.post('/api/areas/add',formData,{
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then((data)=>{
                setNotification(false,'Added Successfully!')
                console.log("data>>>",data)
                setAreas(data.data.areas)
                setShowAdd(false)
            }).catch((err)=>{
                setNotification(true,err.message)
                setShowAdd(false)
            })
        }catch(err){
            setNotification(true, err.message)
            setShowAdd(false)
        }
    }

    function handleRemove(id){
      mernDashApi.get('/api/areas/delete/'+id).then((data)=>{
          setAreas(data.data.areas);
          setNotification(false,"Area removed Successfully!")
        }).catch((err)=>{
          setNotification(true,err.message)
        })
    }

    function handleEdit(id){
      let selectedArea = areas?.filter((area)=>area._id === id)[0]
      setAreaToEdit(selectedArea)
      setShowEdit(true)
    }

    function editArea(name,areaset,id){
      try{
          let formData = new FormData()
          formData.append('id',id)
          formData.append('name', name)
          formData.append('areaset',areaset) 
          mernDashApi.put('/api/areas/update',formData,{
              headers: {
                  'Content-Type': 'application/json',
              }
          }).then((data)=>{
              setAreas(data.data.areas)
              setNotification(false,'Updated Successfully!')
              setShowEdit(false)
          }).catch((err)=>{
              setNotification(true,'Something went wrong!')
              setShowEdit(false)
          })
      }catch(err){
          setNotification(true, err.message)
          setShowAdd(false)
      }
      // const res = await axios.post('/api/auth/login', data);
    }

    useEffect(()=>{
      mernDashApi.get('/api/areas/all').then((data)=>{
        console.log("Data",data.data.areas);
        setAreas(data.data.areas);
      }).catch((err)=>{
        setNotification(true,err.message)
      });
    },[])
  return (
    <>
    <AddModal visible={showAdd} setVisible={setShowAdd} onAdd={handleAdd} />
    <EditModal area={areaToEdit} visible={showEdit} setVisible={setShowEdit} onEdit={editArea} />
    <CRow>
    <CCol xs={12}>
      <CCard className="mb-4">
        <CCardHeader>
          <strong>Areas</strong>
          <CButton color='info' className='float-end' onClick={()=>setShowAdd(true)}>Add Area</CButton>
        </CCardHeader>
        <CCardBody>
            {areas?.length > 0 && <CVTable areas={areas} onRemove={handleRemove} onEdit={handleEdit} />}
        </CCardBody>
      </CCard>
    </CCol>
    </CRow>
    </>
  )
}

export default Areas