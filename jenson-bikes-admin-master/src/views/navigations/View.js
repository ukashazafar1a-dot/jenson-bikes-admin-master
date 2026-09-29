import React, { useEffect, useRef, useState,useContext } from 'react'
import { CForm,CCol,CButton,CFormInput,CFormTextarea,CFormLabel,CCard, CCardBody, CFormSelect, CCardTitle, CSpinner } from '@coreui/react'
import { Formik } from 'formik';
import mernDashApi from 'src/helpers/apiUtils';
import { AppContext } from 'src/context/app/appContext';
import { useNavigate,useParams } from 'react-router-dom';
import ViewLoader from 'src/components/Loaders/ViewLoader';
import CIcon from '@coreui/icons-react';
import { cilControl, cilPlus } from '@coreui/icons';
import AddModal from './Components/AddModal';
import EditModal from './Components/EditModal'
import _ from 'lodash'

function View() {
    const navigate = useNavigate()
    const {id} = useParams()

  const { setNotification } = useContext(AppContext);
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [navigationId,setNavigationId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal,  setOpenEditModal] = useState(false);
  const [selectedItem,setSelectedItem] = useState(null);
  const [menu,setMenu] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isChanged, setIsChanged] = useState(false)
  const [initialValues,setInitialValues] = useState({
    title: '',
  })
  const formRef = useRef();

  const getFormikValues = function(){
    if(formRef?.current) return formRef?.current.values
    return {}
  }

  const validator = function(values){
    const errors = {}
    if(!values.title) errors.title = 'Title is required';
    return errors
  }

  const handleAddItem = function(type,id,parentId){
    setOpenModal(true)
    switch (type) {
        case 'main':
            setSelectedItem({type})
            break;
        case 'child':
            setSelectedItem({type,id})
            break;
        case 'grandChild':
            setSelectedItem({type,id,parentId})
        default:
            break;
    }
  }
  const handleEditItem = function(type,title,url,id,parentId,grandParentId){
    setOpenEditModal(true)
    switch (type) {
        case 'main':
            setSelectedItem({type,title,url,id})
            break;
        case 'child':
            setSelectedItem({type,title,url,id,parentId})
            break;
        case 'grandChild':
            setSelectedItem({type,id,title,url,id,parentId,grandParentId})
        default:
            break;
    }
  }

  const handleAdd  = async function(title,url){
    console.log("Is adding...",title,url,selectedItem.type)
    setOpenModal(false)
    if(!selectedItem) return;
    switch (selectedItem.type) {
        case 'main':
            setMenu([...menu,{
                _id: (Math.random() * 999999)+9999,
                title,
                url,
                children: []
            }])
            break;
        case 'child':
            let newMenu = menu.map((item)=>{
                if(item._id === selectedItem.id){
                    return {...item,children:[...item.children,{
                        _id: (Math.random() * 999999)+9999,
                        title,
                        url,
                        children: []
                    }]}
                }else{
                    return item;
                }
            })
            setMenu([...newMenu])
            break;
        case 'grandChild':
            let newMenu2 = menu.map((item)=>{
                if(item._id === selectedItem.id){
                    let innerMenuChilds = item.children.map((innerItem)=>{
                        if(innerItem._id === selectedItem.parentId){
                            return {...innerItem, children:[...innerItem.children,{
                                _id: (Math.random() * 999999)+9999,
                                title,
                                url
                            }]}
                        }else{
                            return innerItem;
                        }
                    })
                    return {...item, children:innerMenuChilds}
                }else{
                    return item;
                }
            })
            setMenu([...newMenu2])
            break;
        default:
            break;
    }
  }

  const handleEdit = async function(title,url){
    setOpenEditModal(false)
    if(!selectedItem) return;
    switch (selectedItem.type) {
        case 'main':
            let newMenuItems = menu.map((item)=>{
                if(selectedItem.id === item._id){
                    return {...item,title,url}
                }else{
                    return item;
                }
            })
            setMenu(newMenuItems)
            break;
        case 'child':
            let newMenu = menu.map((item)=>{
                if(item._id === selectedItem.id){
                    let newMenuChilds = item.children.map((childItem)=>{
                        if(childItem._id === selectedItem.parentId){
                            return {...childItem,title,url}
                        }else{
                            return childItem
                        }
                    })
                    return {...item,children: newMenuChilds }
                }else{
                    return item;
                }
            })
            setMenu([...newMenu])
            break;
        case 'grandChild':
            let newMenu2 = menu.map((item)=>{
                if(item._id === selectedItem.id){
                    let innerMenuChilds = item.children.map((innerItem)=>{
                        if(innerItem._id === selectedItem.parentId){
                            let grandInnerMenuChilds = innerItem.children.map((grandInnerItem)=>{
                                if(grandInnerItem._id === selectedItem.grandParentId){
                                    return {...grandInnerItem,title,url}
                                }else{
                                    return grandInnerItem
                                }
                            })
                            return {...innerItem, children: grandInnerMenuChilds}
                        }else{
                            return innerItem;
                        }
                    })
                    return {...item, children:innerMenuChilds}
                }else{
                    return item;
                }
            })
            setMenu([...newMenu2])
            break;
        default:
            break;
    }
  }

  const handleRemove = async function(type,id,childId,grandChildId){
    switch (type) {
        case 'main':
            let newMenu = menu.filter((item)=>{
                return item._id !== id
            })
            setMenu(newMenu)
            break;
        case 'child':
            let newMenu2 = menu.map((item)=>{
                if(item._id !== id) return item;
                if(!item.children) return item
                let childs = item.children.filter((childItem)=>{
                    return childItem._id !== childId
                })
                return {...item,children: childs}
            })
            setMenu(newMenu2)
            break;
        case 'grandChild':
            let newMenu3 = menu.map((item)=>{
                if(item._id !== id) return item;
                if(!item.children) return item;
                let childs = item.children.map((childItem)=>{
                    if(childItem._id === childId){
                        let grandChilds = childItem.children.filter((grandChildItem)=>{
                            return grandChildItem._id !== grandChildId
                        })
                        return {...childItem, children: grandChilds}
                    }else{
                        return childItem
                    }
                })
                return {...item, children: childs}
            })
            setMenu(newMenu3)
            break;
        default:
            break;
    }
  }

  const filterIds = function(items){
    let newItems = items.map((item)=>{
        if(item.children && item.children.length){
            let childItems = item.children.map((childItem)=>{
                if(childItem.children && childItem.children.length){
                    let grandChildItems = childItem.children.map((grandChildItem)=>{
                        return _.omit(grandChildItem,['_id'])
                    })

                    return {...(_.omit(childItem,['_id'])), children: grandChildItems}
                }else{
                    return _.omit(childItem,['_id']);
                }
            })
            return {...(_.omit(item,['_id'])), children: childItems}
        }else{
            return _.omit(item,['_id']);
        }
    })
    console.log("New items>>",newItems)
    return newItems
  }

  const submitHandler =  async function(){
    try{
        setIsSubmitting(true)
        const {title} = getFormikValues()

        let items = filterIds(menu);

        let formData = new FormData()
        formData.append('title',title);
        formData.append('items', JSON.stringify(items))

        mernDashApi.post('/api/navigations/update/'+navigationId,formData,{
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }).then((data)=>{
            setIsSubmitting(false)
            setNotification(false,'Updated Successfully!')
        }).catch((err)=>{
            setIsSubmitting(false)
            setNotification(true, 'Something went wrong!')
        })
    }catch(err){
        setNotification(true, err.message)
        console.log("Errr",err)
    }
    // const res = await axios.post('/api/auth/login', data);
  }


  const removeNavigation = function(){
    try {
        mernDashApi.get('/api/navigations/delete/'+navigationId).then((data)=>{
            setNotification(false,'Navigation removed!')
            navigate('/navigations')
        }).catch((err)=>{
            setNotification(true,'Something went wrong!')
        })
    } catch (error) {
        setNotification(true, error.message)
        console.log("Errr",error)
    }
  }

  useEffect(()=>{
    const getNavigation = async ()=>{
      const {data,status} = await mernDashApi.get('/api/navigations/'+id)
      const {navigation} = data
      if(status === 200){
        setInitialValues({
            title : navigation.title,
        })
        setNavigationId(navigation._id)
        setMenu(navigation.children)
        setIsLoading(false)
      }
      console.log("Data>>",data,status)
    }
    getNavigation()
  },[])

  if(isLoading) return <ViewLoader/>;

  return (
    <>
        <AddModal open={openModal} setOpen={setOpenModal} onAdd={handleAdd}/>
        <EditModal open={openEditModal} setOpen={setOpenEditModal} 
        data={{title:selectedItem?.title,url:selectedItem?.url}} 
        onEdit={handleEdit}  />
        <Formik 
            innerRef={formRef}
            initialValues={initialValues}
            validate={validator}
            onSubmit={()=>{
                submitHandler()
            }}>
                {({values,errors,touched,handleSubmit,handleChange,setFieldValue})=>(
            <CForm className='row' onSubmit={handleSubmit}>
            <CCol md={12} className="px-4 py-3 rounded-3">
                <div className="row g-3">
                <CCard>
                    <CCardBody>
                            <CFormInput type="text" name='title' 
                                    id="inputEmail4" label="Title" value={values.title} 
                                    onChange={handleChange} feedbackInvalid={errors.title} invalid={errors.title && touched.title} />
                        </CCardBody>
                    </CCard>
                    <CCard>
                        <CCardBody>
                            <CCardTitle>Menu Items</CCardTitle>
                            <div className='menu-items'>
                                {menu.map((item=>{
                                    return <div key={item._id} className='menu-item'>
                                        <div className='menu-item--content'>
                                            <CIcon icon={cilControl} />
                                            <span className='item-text'>{item.title}</span>
                                            <div className='menu-actions'>
                                                <span onClick={(e)=>handleEditItem('main',item.title,item.url,item._id)}>Edit</span>
                                                <span onClick={(e)=>handleRemove('main',item._id)}>Delete</span>
                                                {item.children.length == 0 && <span onClick={(e)=>handleAddItem('child',item._id)}>Add Item</span>}
                                            </div>
                                        </div>
                                        {item.children.length != 0 && <div className='menu-item-children'>
                                            {item.children.map((childItem)=>{
                                             return  <div key={childItem._id} className='menu-item-child'>
                                                    <div className='menu-item--content'>
                                                    <CIcon icon={cilControl} />
                                                    <span className='item-text'>{childItem.title}</span>
                                                    <div className='menu-actions'>
                                                        <span onClick={(e)=>handleEditItem('child',childItem.title,childItem.url,item._id,childItem._id)}>Edit</span>
                                                        <span onClick={(e)=>handleRemove('child',item._id,childItem._id)}>Delete</span>
                                                        {childItem.children.length == 0 && <span onClick={(e)=>handleAddItem('grandChild',item._id,childItem._id)}>Add Item</span>}
                                                    </div>
                                                    </div>
                                                    {childItem.children.length != 0 && <div className='menu-item-grandChildren'>
                                                        {childItem.children.map((grandChildItem)=>{
                                                            return <><div className='menu-item-grandChild'>
                                                            <div className='menu-item--content'>
                                                                <CIcon icon={cilControl} />
                                                                <span className='item-text'>{grandChildItem.title}</span>
                                                                <div className='menu-actions'>
                                                                    <span onClick={(e)=>handleEditItem('grandChild',grandChildItem.title,grandChildItem.url,item._id,childItem._id,grandChildItem._id)}>Edit</span>
                                                                    <span onClick={(e)=>handleRemove('grandChild', item._id,childItem._id,grandChildItem._id)}>Delete</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        </>})}
                                                        <div className='menu-item-grandChild' onClick={(e)=>handleAddItem('grandChild',item._id,childItem._id)}>
                                                            <div className='menu-item--content interactive'>
                                                                <CIcon icon={cilPlus} />
                                                                <span className='item-text'>Add Menu Item to <strong>{childItem.title}</strong></span>
                                                            </div>
                                                        </div>
                                                    </div>}
                                                </div>
                                            })}
                                            <div className='menu-item-child' onClick={(e)=>handleAddItem('child',item._id)}>
                                                <div className='menu-item--content interactive'>
                                                    <CIcon icon={cilPlus} />
                                                    <span className='item-text'>Add Menu Item to <strong>{item.title}</strong></span>
                                                </div>
                                            </div>
                                        </div>}
                                    </div>
                                }))}
                                <div className='menu-item' onClick={(e)=>handleAddItem('main')}>
                                    <div className='menu-item--content interactive'>
                                        <CIcon icon={cilPlus} />
                                        <span className='item-text'>Add Menu Item</span>
                                    </div>
                                </div>
                            </div>
                        </CCardBody>
                    </CCard>
                </div>
            </CCol>

            <hr/>
            <CCol xs={12} className="text-center mb-3 d-flex justify-content-between">
                <CButton color='danger' onClick={()=>removeNavigation()}>Delete Navigation</CButton>
                <CButton type="submit" color='info' style={{color:'white'}}>
                    {isSubmitting ? (<CSpinner component="span" size="sm" aria-hidden="true"/>) :
                    ('Save') }
                </CButton>
            </CCol>
        </CForm>
            )}
        </Formik>
    </>
  )
}

export default View