import React, { useEffect,useState } from 'react'
import { useParams } from 'react-router-dom'
import { CContainer,CRow,CCol,CBadge, CButton, CCarousel,CCarouselItem, CImage } from '@coreui/react';
import fileDownload from 'js-file-download'
import mernDashApi from 'src/helpers/apiUtils';
import axios from 'axios';
   

function View() {
    const {id} = useParams()
    const [template,setTemplate] = useState(null);

    const handleDownload = (url, filename) => {
        axios.get(url, {
          responseType: 'blob',
        })
        .then((res) => {
          fileDownload(res.data, filename)
        })
    }

    function download(){
        // let extension = template?.cv[0]?.path?.split('.').pop();
        // if(extension){
            handleDownload(template?.cv[0]?.path, 'cv-template.'+'.docx')
        // }
    }

    useEffect(()=>{
        const loadTemplate =async ()=>{
            const {data} = await mernDashApi.get('/api/cvtemplates/template/'+id)
            setTemplate(data.template)
        }
        loadTemplate()
    },[])

  return (
    <CContainer>
        {template && <CRow>
            <CCol className='text-center'>
                <CCarousel controls indicators dark transition="crossfade">
                    {template?.preview.map((item,i)=>{
                        return  <CCarouselItem>
                                <CImage className="d-block w-100" src={item?.path} alt="slide 1" />
                            </CCarouselItem>
                    })}
                </CCarousel>
            </CCol>
            <CCol>
                <h4>{template?.title}</h4>
                <small>{template?.price} AED</small><CBadge color="warning" shape="rounded-pill" style={{marginLeft:'2rem'}}>{template?.isPaid ? 'Paid' : 'Free'}</CBadge>
                <br/>
                <br/>
                {template.cv && <>
                    <h2>CV</h2>
                    <p>{template?.cv[0]?.name}</p>
                    <CButton onClick={download}>Download</CButton>
                </>}
            </CCol>
        </CRow>}
  </CContainer>
  )
}

export default View