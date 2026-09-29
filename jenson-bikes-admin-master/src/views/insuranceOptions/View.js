import React, { useContext, useEffect,useState } from 'react'
import { useParams } from 'react-router-dom'
import { CContainer,CRow,CCol,CBadge } from '@coreui/react';
import { AppContext } from 'src/context/app/appContext';
import { getInsuranceOption } from 'src/helpers/businessRequests';
   

function View() {
    const { setNotification } = useContext(AppContext)
    const {id} = useParams()
    const [option,setOption] = useState(null);


    useEffect(()=>{
        const loadOption =async ()=>{
            try {
                const {data} = await getInsuranceOption(id)
                setOption(data)
            } catch (error) {
                setNotification(true,error.message)
            }
        }
        loadOption()
    },[id])

  return (
    <CContainer>
        {option && <CRow>
            <CCol>
                <h4>{option?.name}</h4>
                <CBadge color="warning" shape="rounded-pill">{option?.isActive ? 'Active' : 'Draft'}</CBadge>
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
                            <td>{option?.name}</td>
                        </tr>
                        <tr>
                            <th scope='row'>Coverage</th>
                            <td>{option?.coverage} USD</td>
                        </tr>
                        <tr>
                            <th scope='row'>Cost</th>
                            <td>{option?.cost} USD</td>
                        </tr>
                        <tr>
                            <th scope='row'>Description</th>
                            <td>{option?.description ? option.description : '-'}</td>
                        </tr>
                    </tbody>
                </table>
            </CCol>
        </CRow>}
  </CContainer>
  )
}

export default View