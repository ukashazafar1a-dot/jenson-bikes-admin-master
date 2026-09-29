import React, { useEffect,useState } from 'react'
import { useParams } from 'react-router-dom'
import { CContainer,CRow,CCol,CBadge } from '@coreui/react';
import mernDashApi from 'src/helpers/apiUtils';
import axios from 'axios';
import { packagePurposes } from 'src/assets/data';
   

function View() {
    const {id} = useParams()
    const [purpose,setPurpose] = useState(null);


    useEffect(()=>{
        const loadPurpose =async ()=>{
            // const {data} = await mernDashApi.get('/api/cvtemplates/template/'+id)
            // setTemplate(data.template)
            const purposes = packagePurposes
            let purpose = purposes.find((op)=>op.id == id)
            setPurpose(purpose)
        }
        loadPurpose()
    },[])

  return (
    <CContainer>
        {purpose && <CRow>
            <CCol>
                <h4>{purpose?.name}</h4>
                <CBadge color="warning" shape="rounded-pill">{purpose?.isActive ? 'Active' : 'Draft'}</CBadge>
                <br/>
                <br/>
                <table className='table'>
                    <thead>
                        <tr>
                            <th scope='col'>Key</th>
                            <th scope='col'>Value</th>
                        </tr>
                    </thead>
                    <tbody className='table-group-divider'>
                        <tr>
                            <th scope='row'>Name</th>
                            <td>{purpose?.name}</td>
                        </tr>
                        <tr>
                            <th scope='row'>Code</th>
                            <td>{purpose?.code}</td>
                        </tr>
                    </tbody>
                </table>
            </CCol>
        </CRow>}
  </CContainer>
  )
}

export default View