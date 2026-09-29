import React, { useEffect, useState,useContext } from 'react'
import { CRow,CCol,CCard,CCardHeader,CCardBody,CTable,CTableHead,CTableRow,CTableHeaderCell,CTableBody,CTableDataCell, CButton } from '@coreui/react'
import { CModal,CModalHeader,CModalTitle,CModalFooter } from '@coreui/react'
import {cilTrash, cilPen} from '@coreui/icons'
import { AppContext } from 'src/context/app/appContext'
import AddModal from './AddModalSizes.js'
import EditModal from './EditModalSizes.js'
import mernDashApi from 'src/helpers/apiUtils'
import CIcon from '@coreui/icons-react'

function CVTable({areasPassportSizes,onRemove,onEdit}){
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
                  <CTableHeaderCell scope="col">Areaset</CTableHeaderCell>
                  <CTableHeaderCell scope='col'>Per Person Photos</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Price</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                </CTableRow>
            </CTableHead>
            <CTableBody>
              {areasPassportSizes?.map((area,i)=>{
                return (
                  <CTableRow className="align-middle" key={area._id}>
                      <CTableHeaderCell scope="row">{i+1}</CTableHeaderCell>
                      <CTableDataCell>{area.areaset}</CTableDataCell>
                      <CTableDataCell>{area.perPersonPhotos}</CTableDataCell>
                      <CTableDataCell>{area.price} AED</CTableDataCell>
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

function PassportSizePhotos() {
    const {setNotification} = useContext(AppContext)
    const [showAdd,setShowAdd] = useState(false)
    const [showEdit, setShowEdit] = useState(false)
    const [areaToEdit, setAreaToEdit] = useState({})
    const [areasPassportSizes,setAreasPassportSizes]  = useState([])

    function handleAdd(areaset,price,perPersonPhotos){
        try{
            let formData = new FormData()
            formData.append('areaset',areaset);
            formData.append('price',price);
            formData.append('perPersonPhotos', perPersonPhotos)
            mernDashApi.post('/api/areasPassportSizes/add',formData,{
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then((data)=>{
                setNotification(false,'Added Successfully!')
                console.log("data>>>",data)
                setAreasPassportSizes(data.data.areasPassportSizes)
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
      mernDashApi.get('/api/areasPassportSizes/delete/'+id).then((data)=>{
          setAreasPassportSizes(data.data.areasPassportSizes);
          setNotification(false,"Removed Successfully!")
        }).catch((err)=>{
          setNotification(true,err.message)
        })
    }

    function handleEdit(id){
      let selectedArea = areasPassportSizes?.filter((area)=>area._id === id)[0]
      setAreaToEdit(selectedArea)
      setShowEdit(true)
    }

    function editArea(areaset,price, perPersonPhotos,id){
      try{
          let formData = new FormData()
          formData.append('id',id)
          formData.append('areaset', areaset)
          formData.append('price',price)
          formData.append('perPersonPhotos', perPersonPhotos)
          mernDashApi.put('/api/areasPassportSizes/update',formData,{
              headers: {
                  'Content-Type': 'application/json',
              }
          }).then((data)=>{
              console.log("data",data)
              setAreasPassportSizes(data.data.areasPassportSizes)
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
      mernDashApi.get('/api/areasPassportSizes/all').then((data)=>{
        console.log("Data",data.data.areasPassportSizes);
        setAreasPassportSizes(data.data.areasPassportSizes);
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
          <strong>Passport Size Prices</strong>
          <CButton color='info' className='float-end' onClick={()=>setShowAdd(true)}>Add Value</CButton>
        </CCardHeader>
        <CCardBody>
            {areasPassportSizes?.length > 0 && <CVTable areasPassportSizes={areasPassportSizes} onRemove={handleRemove} onEdit={handleEdit} />}
        </CCardBody>
      </CCard>
    </CCol>
    </CRow>
    </>
  )
}

export default PassportSizePhotos