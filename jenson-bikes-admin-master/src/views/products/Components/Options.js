import React, { useState,useContext, useEffect } from 'react'
import { cilPen, cilPlus, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import AddOptionModal from './AddOptionModal'
import { CBadge } from '@coreui/react'
import EditOptionModal from './EditOptionModal'
import { AppContext } from 'src/context/app/appContext'
import mernDashApi from 'src/helpers/apiUtils'
import ContentLoader from 'src/components/Loaders/ContentLoader'

function Options({productId}) {
    const {setNotification} = useContext(AppContext)
    const [options,setOptions] = useState([])
    const [selectedOption,setSelectedOption] = useState(null)
    const [openAddModal,setOpenAddModal]  = useState(false)
    const [openEditModal, setOpenEditModal] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

  function handleAddOption(e){
    e.preventDefault()
    console.log("Add optin")
    setOpenAddModal(true)
  }

  function handleEditOption(e,id){
    e.preventDefault()
    let selected = options.find((option)=>option._id==id)
    setSelectedOption(selected)
    setOpenEditModal(true)
  }

  async function handleRemoveOption(e,id){
    e.preventDefault()
    try{
        let formData = new FormData()
        formData.append('product_id',productId)
        formData.append('option_id',id)

        const {data,status} = await mernDashApi.post('/api/products/option/delete',formData,{
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        if(status === 200){
            setOptions(data.options)
            setNotification(false, 'Removed Successfully!')
        }else{
            setNotification(true, 'Something went wrong!')
        }
    }catch(err){
        setNotification(true, err.message)
        console.log("Errr",err)
    }
  }

  async function onAddOption(name,values){
    try{
        let formData = new FormData()
        formData.append('product_id',productId)
        let option = {
            name,
            values
        }
        formData.append('option',JSON.stringify(option))
        const {data,status} = await mernDashApi.post('/api/products/option',formData,{
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        if(status === 200){
            setOptions(data.options)
            setNotification(false, 'Added Successfully!')
        }else{
            setNotification(true, 'Something went wrong!')
        }
    }catch(err){
        setNotification(true, err.message)
        console.log("Errr",err)
    }

  }

  async function onEditOption(id,name,values){
    try{
        let formData = new FormData()
        formData.append('product_id',productId)
        formData.append('id',id)
        formData.append('option',JSON.stringify({
            name,
            values
        }))

        const {data,status} = await mernDashApi.put('/api/products/option',formData,{
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        if(status === 200){
            setOptions(data.options)
            setNotification(false, 'Option updated!')
        }else{
            setNotification(true, 'Something went wrong!')
        }
    }catch(err){
        setNotification(true, err.message)
        console.log("Errr",err)
    }
  }

  useEffect(()=>{
    const getOptions = async ()=>{
        const {data,status} = await mernDashApi.get('/api/products/option/'+productId)
        const {options} = data
        if(status === 200){
          setOptions(options)
          setIsLoading(false)
        }
      }
      getOptions()
  },[])

  if(isLoading) return <ContentLoader/>

  return (
    <div>
        <AddOptionModal open={openAddModal} setOpen={setOpenAddModal} onAdd={onAddOption}/>
        <EditOptionModal open={openEditModal} setOpen={setOpenEditModal} option={selectedOption} onEdit={onEditOption} />
        <div>
            {options.map((option,i)=>{
                return <div key={i} className='option-item'>
                    <div>
                    <p className='option-name'>{option.name}</p>
                    <div className='option-values'>
                        {option.values.map((value,index)=>{
                            return <CBadge key={index} className='align-items-center d-inline-flex mb-2' style={{color:'#202223',backgroundColor:'#e4e5e7',marginRight:"10px"}}>
                            {value}
                        </CBadge>})}
                    </div>
                    </div>
                    <div>
                        <button className='option-btn' onClick={(e)=>handleEditOption(e,option._id)}>
                            <CIcon icon={cilPen} />
                        </button>
                        <button className='option-btn'>
                            <CIcon icon={cilTrash} onClick={(e)=>handleRemoveOption(e,option._id)}/>
                        </button>
                    </div>
                </div>;
            })}
            {options.length < 3 && <button className='add-button' onClick={handleAddOption}>
                <CIcon icon={cilPlus}/>
                Add Option
            </button>}
        </div>
    </div>
  )
}

export default Options