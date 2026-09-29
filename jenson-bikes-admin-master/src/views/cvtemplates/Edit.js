import React, { useEffect, useRef, useState,useContext } from 'react'
import { CForm,CCol,CButton,CFormInput,CFormCheck,CInputGroup,CInputGroupText,CFormLabel } from '@coreui/react'
import { Formik } from 'formik';
import mernDashApi from 'src/helpers/apiUtils';
import { AppContext } from 'src/context/app/appContext';
import ImageDropzone from '../../components/ImageDropzone'
import { useNavigate,useParams } from 'react-router-dom';
import docPlaceholder from '../../assets/images/docx.png'

function Edit() {
    const navigate = useNavigate()
    const {id} = useParams()

  const { setNotification } = useContext(AppContext);
  const [preview,setPreview] = useState([]);
  const [cv,setCv] = useState([]);
  const [templateId,setTemplateId] = useState();
  const formRef = useRef();
  const initialValues = {
    title: '',
    isPaid: false,
    price: 0,
    file: null
  }

  const getFormikValues = function(){
    if(formRef?.current) return formRef?.current.values
    return {}
  }

  const validator = function(values){
    const errors = {}
    if(!values.title) errors.title = 'Title is required';
    return errors
  }

  const submitHandler =  async function(){
    try{
        const {title,isPaid,price} = getFormikValues()
        let formData = new FormData()
        formData.append('id',templateId)
        formData.append('title',title);
        formData.append('isPaid',isPaid);

        if(!isPaid){
            formData.append('price',0)
        }else{
            formData.append('price',price)
        }
        mernDashApi.put('/api/cvtemplates/update',formData,{
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }).then((data)=>{
            setNotification(false,'Updated Successfully!')
            navigate('/cv-templates')
        }).catch((err)=>{
            setNotification(true,'Something went wrong!')
        })
    }catch(err){
        setNotification(true, err.message)
        console.log("Errr",err)
    }
    // const res = await axios.post('/api/auth/login', data);
  }

  const onRemovePreview = async function(e,preview){
    e.preventDefault();
    console.log("Privew",preview);
    try {
        let formData = new FormData()
        formData.append('preview',preview.id);
        formData.append('id',templateId)

        mernDashApi.put('/api/cvtemplates/preview/delete',formData).then((data)=>{
            setPreview(data.data.preview);
            setNotification(false,'Preview removed!')
        }).catch((err)=>{
            setNotification(true,'Something went wrong!')
        })
    } catch (error) {
        setNotification(true, error.message)
        console.log("Errr",error)
    }
  }

  const onAddPreview = async function(e){
    if(!e.currentTarget.files[0]) return;
    let preview  = e.currentTarget.files[0];
    e.preventDefault();
    try {
        let formData = new FormData()
        formData.append('preview',preview);
        formData.append('id',templateId)

        mernDashApi.put('/api/cvtemplates/preview/add',formData,{
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }).then((data)=>{
            setPreview(data.data.preview);
            setNotification(false,'Preview added!')
        }).catch((err)=>{
            console.log("Error:",err)
            setNotification(true,'Something went wrong!')
        })
    } catch (error) {
        setNotification(true, error.message)
        console.log("Errr",error)
    }

  }

  const updateCV  = async function(file){
    try{
        let formData = new FormData()
        formData.append('cv',file)
        formData.append('id',templateId)

        mernDashApi.put('/api/cvtemplates/cv/update',formData,{
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }).then((data)=>{
            setCv(data.data.cv)
            setNotification(false,'Document Updated Successfully!')
        }).catch((err)=>{
            setNotification(true,'Something went wrong!')
        })
    }catch(err){
        setNotification(true, err.message)
        console.log("Errr",err)
    }
  }

  useEffect(()=>{
    const getTemplate = async ()=>{
      const { data } = await mernDashApi.get('/api/cvtemplates/template/'+id)
      formRef.current.setFieldValue('title',data.template.title)
      formRef.current.setFieldValue('isPaid',data.template.isPaid)
      formRef.current.setFieldValue('price',data.template.price)
      setCv(data.template?.cv)
      setPreview(data.template?.preview)
      setTemplateId(data.template._id)
      console.log("Data",data)
    }
    getTemplate()
  },[])

  return (
    <>
    <Formik 
        innerRef={formRef}
        initialValues={initialValues}
        validate={validator}
        onSubmit={()=>{
            submitHandler()
        }}>
            {({values,errors,touched,isValid,handleSubmit,handleChange,setFieldValue})=>(
        <CForm className="row g-3" onSubmit={handleSubmit}>
            <CCol md={6}>
                <CFormInput type="text" name='title' 
                        id="inputEmail4" label="Title" value={values.title} 
                        onChange={handleChange} feedbackInvalid={errors.title} invalid={errors.title && touched.title} />
            </CCol>
            <CCol md={6} className="row mt-3">
                <CCol md={6}>
                <CFormInput type='file' label="Update Document" accept='.doc,.docx'
                    onChange={(e)=>updateCV(e.currentTarget.files[0])}
                    feedbackInvalid={errors.file} invalid={errors.file && touched.file}/>
                </CCol>
                <CCol md={6}>
                    <div>
                        <img src={docPlaceholder} className="w-50"/>
                        <p>{cv[0]?.name}</p>
                    </div>
                </CCol>
            </CCol>
            <CCol xs={12}>
                <CFormLabel htmlFor='preview'>Preview</CFormLabel>
                <div id='preview py-4'>
                    <div className='row'>
                        {preview?.map((p)=>{
                            return <div className='col-lg-3 py-3'>
                            <div className='w-100 img-card-custom' style={{backgroundImage: `url(${p?.path})`}}>
                                <div class="ng-star-inserted" className='custom-badge' onClick={(e)=>onRemovePreview(e,p)}>
                                    <svg style={{height: '10px',width: '10px'}}>
                                        <line style={{stroke: '#fff',strokeWidth: '2px'}} x1="0" y1="0" x2="10" y2="10"></line>
                                        <line style={{stroke: '#fff',strokeWidth: '2px'}} x1="0" y1="10" x2="10" y2="0"></line>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        })}
                        <div className='col-lg-3 py-3'>
                            <div className='w-100 img-card-custom' style={{background:'darkgrey'}}>
                                <div className='img-card-custom__placeholder'>
                                    <p>Upload Preview</p>
                                </div>
                                <input type='file' accept='image/*' style={{position: 'absolute',top: '0',bottom: '0',right: '0',left: '0',opacity: '0'}} onChange={(e)=>onAddPreview(e)} />
                            </div>
                        </div>
                    </div>
                </div>
            </CCol>
            <CCol xs={12}>
                <CFormCheck type="checkbox" id="gridCheck" label="Is Paid" name='file' 
                checked={values.isPaid} onChange={(e)=>setFieldValue('isPaid', !values.isPaid)}/>
            </CCol>
            {values.isPaid && <CCol md={12}>
                <CFormLabel htmlFor="autoSizingInputGroup">Price</CFormLabel>
                <CInputGroup>
                    <CFormInput id="autoSizingInputGroup" type='number' name='price' value={values.price}
                     onChange={handleChange}
                     placeholder="Price"/>
                    <CInputGroupText>AED</CInputGroupText>
                </CInputGroup>
            </CCol>}
            <CCol xs={12} className="text-center">
                <CButton type="submit" color='info'>Update</CButton>
            </CCol>
        </CForm>
        )}
    </Formik>
    </>
  )
}

export default Edit