import React, { useEffect, useState,useContext } from 'react'
import { CRow,CCol,CCard,CCardHeader,CCardBody,CTable,CTableHead,CTableRow,CTableHeaderCell,CTableBody,CTableDataCell, CButton } from '@coreui/react'
import { CModal,CModalHeader,CModalTitle,CModalFooter } from '@coreui/react'
import {cilTrash, cilPen} from '@coreui/icons'
import { AppContext } from 'src/context/app/appContext'
import AddModal from './AddModal'
import EditModal from './EditModal'
import CIcon from '@coreui/icons-react'
import mernDashApi from 'src/helpers/apiUtils'

function CVTable({purposes,onRemove,onEdit}){
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
                  <CTableHeaderCell scope="col">Title</CTableHeaderCell>
                  <CTableHeaderCell scope="col" style={{float:'right'}}>Actions</CTableHeaderCell>
                </CTableRow>
            </CTableHead>
            <CTableBody>
              {purposes?.map((purpose,i)=>{
                return (
                  <CTableRow className="align-middle" key={purpose._id}>
                      <CTableHeaderCell scope="row">{i+1}</CTableHeaderCell>
                      <CTableDataCell>{purpose.title}</CTableDataCell>
                      <CTableDataCell style={{float: 'right'}}>
                        <CButton color="danger" style={{marginRight: '1rem'}} onClick={(e)=>handleRemove(purpose._id)}>
                          <CIcon icon={cilTrash} />
                        </CButton>
                        <CButton color="info" onClick={(e)=>onEdit(purpose._id)}>
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

function Purposes() {
    const {setNotification} = useContext(AppContext)
    const [showAdd,setShowAdd] = useState(false)
    const [showEdit, setShowEdit] = useState(false)
    const [purposeToEdit, setPurposeToEdit] = useState({})
    const [purposes,setPurposes]  = useState([])

    function handleAdd(title){
        try{
            let formData = new FormData()
            formData.append('title',title);
            mernDashApi.post('/api/purposes/add',formData,{
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then((data)=>{
                setNotification(false,'Added Successfully!')
                console.log("data>>>",data)
                setPurposes(data.data.purposes)
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
      mernDashApi.get('/api/purposes/delete/'+id).then((data)=>{
          setPurposes(data.data.purposes);
          setNotification(false,"Removed Successfully!")
        }).catch((err)=>{
          setNotification(true,err.message)
        })
    }

    function handleEdit(id){
      let selectedPurposes = purposes?.filter((area)=>area._id === id)[0]
      setPurposeToEdit(selectedPurposes)
      setShowEdit(true)
    }

    function editPurpose(title,id){
      try{
          let formData = new FormData()
          formData.append('id',id)
          formData.append('title', title)
          mernDashApi.put('/api/purposes/update',formData,{
              headers: {
                  'Content-Type': 'application/json',
              }
          }).then((data)=>{
            console.log(data)
              setPurposes(data.data.purposes)
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
      mernDashApi.get('/api/purposes/all').then((data)=>{
        setPurposes(data.data.purposes);
      }).catch((err)=>{
        setNotification(true,err.message)
      });
    },[])
  return (
    <>
    <AddModal visible={showAdd} setVisible={setShowAdd} onAdd={handleAdd} />
    <EditModal area={purposeToEdit} visible={showEdit} setVisible={setShowEdit} onEdit={editPurpose} />
    <CRow>
    <CCol xs={12}>
      <CCard className="mb-4">
        <CCardHeader>
          <strong>Purposes</strong>
          <CButton color='info' className='float-end' onClick={()=>setShowAdd(true)}>Add Value</CButton>
        </CCardHeader>
        <CCardBody>
            {purposes?.length > 0 && <CVTable purposes={purposes} onRemove={handleRemove} onEdit={handleEdit} />}
        </CCardBody>
      </CCard>
    </CCol>
    </CRow>
    </>
  )
}

export default Purposes