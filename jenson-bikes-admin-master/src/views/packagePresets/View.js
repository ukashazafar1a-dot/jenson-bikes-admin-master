import React, { useEffect,useState } from 'react'
import { useParams } from 'react-router-dom'
import { CContainer,CRow,CCol,CBadge } from '@coreui/react';
import mernDashApi from 'src/helpers/apiUtils';
import axios from 'axios';
import { packagePresets } from 'src/assets/data';
import { getPackagePreset } from 'src/helpers/businessRequests';
   

function View() {
    const {id} = useParams()
    const [preset,setPreset] = useState(null);


    useEffect(()=>{
        const loadPreset =async ()=>{
            try {
                const {data} = await getPackagePreset(id)
                setPreset(data)
            } catch (error) {
                setNotification(true,error.message)
            }
        }
        loadPreset()
    },[id])

  return (
    <CContainer>
        {preset && <CRow>
            <CCol>
                <h4>{preset?.name}</h4>
                <CBadge color="warning" shape="rounded-pill">{preset?.isActive ? 'Active' : 'Draft'}</CBadge>
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
                            <td>{preset?.name}</td>
                        </tr>
                        <tr>
                            <th scope='row'>Length</th>
                            <td>{preset?.length} {preset?.linearUnit}</td>
                        </tr>
                        <tr>
                            <th scope='row'>Width</th>
                            <td>{preset?.width} {preset?.linearUnit}</td>
                        </tr>
                        <tr>
                            <th scope='row'>Height</th>
                            <td>{preset?.height} {preset?.linearUnit}</td>
                        </tr>
                        <tr>
                            <th scope='row'>Weight</th>
                            <td>{preset?.weight} {preset?.weightUnit}</td>
                        </tr>
                        <tr>
                            <th scope='row'>isExact</th>
                            <td>{preset?.isExact ? 'True' : 'False'}</td>
                        </tr>
                    </tbody>
                </table>
            </CCol>
        </CRow>}
  </CContainer>
  )
}

export default View