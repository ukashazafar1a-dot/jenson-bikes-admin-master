import React, { useContext, useEffect,useState } from 'react'
import { useParams } from 'react-router-dom'
import { CContainer,CRow,CCol,CBadge } from '@coreui/react';
import mernDashApi from 'src/helpers/apiUtils';
import { AppContext } from 'src/context/app/appContext';
   

function View() {
    const {id} = useParams()
    const {setNotification} = useContext(AppContext)
    const [order,setOrder] = useState(null);

    async function handleOrderFulfillment(id){
        const {data} = await mernDashApi.post('/api/orders/storeOrder/fulfill/'+id)
        setOrder(data.order)
        setNotification(false,'Order is marked fulfilled!')
    }

    useEffect(()=>{
        const loadorder =async ()=>{
            const {data} = await mernDashApi.get('/api/orders/storeOrders/'+id)
            console.log("Order", data.order)
            setOrder(data.order)
        }
        loadorder()
    },[])

  return (
    <>
    {order && <CContainer>
            <CRow>
                {/* <CCol className='text-center'>
                    <img src={"/public/cvtemplates/"+template?.preview} className="w-50 rounded-4" />
                </CCol> */}
                <CCol>
                    <h4>{'# ' + order?._id}</h4>
                    <small>{order?.price} AED</small><CBadge color={order?.status === "CAPTURED" ? "success" : "danger"} shape="rounded-pill" style={{marginLeft:'2rem'}}>{order?.status}</CBadge>

                    <div className='my-4'>
                        <p><strong>Token:</strong>{' '} <small>{order?.token}</small></p>
                        <p><strong>Charge ID:</strong> {' '} <small>{order?.chg_id}</small></p>
                    </div>

                    <h5 className='mb-3'>Customer</h5>
                    <table style={{fontFamily: 'arial, sans-serif', borderCollapse: 'collapse', width: '100%', marginTop: '2rem'}}>
                        <tr style={{backgroundColor: '#dddddd'}}>
                        <td style={{border: '1px solid #dddddd', textAlign: 'left', padding: '8px'}} >First Name</td>
                        </tr>
                        <tr>
                        <td style={{border: '1px solid #dddddd', textAlign: 'left', padding: '8px 8px 8px 30px'}} >{order?.customer?.firstname}</td>
                        </tr>

                        <tr style={{backgroundColor: '#dddddd'}}>
                        <td style={{border: '1px solid #dddddd', textAlign: 'left', padding: '8px'}}>Last Name</td>
                        </tr>
                        <tr>
                        <td style={{border: '1px solid #dddddd', textAlign: 'left', padding: '8px 8px 8px 30px'}}>{order?.customer?.lastname}</td>
                        </tr>

                        <tr style={{backgroundColor: '#dddddd'}}>
                        <td style={{border: '1px solid #dddddd', textAlign: 'left', padding: '8px'}}>Phone</td>
                        </tr>
                        <tr>
                        <td style={{border: '1px solid #dddddd', textAlign: 'left', padding: '8px 8px 8px 30px'}}>{order?.customer?.phone}</td>
                        </tr>
                        <tr style={{backgroundColor: '#dddddd'}}>
                        <td style={{border: '1px solid #dddddd', textAlign: 'left', padding: '8px'}}>Email</td>
                        </tr>
                        <tr>
                        <td style={{border: '1px solid #dddddd', textAlign: 'left', padding: '8px 8px 8px 30px'}}>{order?.customer?.email}</td>
                        </tr>

                        <tr style={{backgroundColor: '#dddddd'}}>
                        <td style={{border: '1px solid #dddddd', textAlign: 'left', padding: '8px'}}>Address</td>
                        </tr>
                        <tr>
                        <td style={{border: '1px solid #dddddd', textAlign: 'left', padding: '8px 8px 8px 30px'}}>{order?.customer?.address ? order?.customer?.address : '-'}</td>
                        </tr>

                        <tr style={{backgroundColor: '#dddddd'}}>
                        <td style={{border: '1px solid #dddddd', textAlign: 'left', padding: '8px'}}>City</td>
                        </tr>
                        <tr>
                        <td style={{border: '1px solid #dddddd', textAlign: 'left', padding: '8px 8px 8px 30px'}}>{order?.customer?.city ? order?.customer?.city : '-'}</td>
                        </tr>
                        <tr style={{backgroundColor: '#dddddd'}}>
                        <td style={{border: '1px solid #dddddd', textAlign: 'left', padding: '8px'}}>Apartment</td>
                        </tr>
                        <tr>
                        <td style={{border: '1px solid #dddddd', textAlign: 'left', padding: '8px 8px 8px 30px'}}>{order?.customer?.apartment ? order.customer.apartment : '-'}</td>
                        </tr>

                        <tr style={{backgroundColor: '#dddddd'}}>
                        <td style={{border: '1px solid #dddddd', textAlign: 'left', padding: '8px'}}>Phone</td>
                        </tr>
                        <tr>
                        <td style={{border: '1px solid #dddddd', textAlign: 'left', padding: '8px 8px 8px 30px'}}>{order?.customer?.phone}</td>
                        </tr>
                        <tr style={{backgroundColor: '#dddddd'}}>
                        <td style={{border: '1px solid #dddddd', textAlign: 'left', padding: '8px'}}>Area</td>
                        </tr>
                        <tr>
                        <td style={{border: '1px solid #dddddd', textAlign: 'left', padding: '8px 8px 8px 30px'}}>{order?.customer?.area ? order?.customer?.area : '-'}</td>
                        </tr>

                        <tr style={{backgroundColor: '#dddddd'}}>
                        <td style={{border: '1px solid #dddddd', textAlign: 'left', padding: '8px'}}>Delivery Charges</td>
                        </tr>
                        <tr>
                        <td style={{border: '1px solid #dddddd', textAlign: 'left', padding: '8px 8px 8px 30px'}}>{'AED '}{order?.deliveryCharges}</td>
                        </tr>

                        <tr style={{backgroundColor: '#dddddd'}}>
                        <td style={{border: '1px solid #dddddd', textAlign: 'left', padding: '8px'}}>Price</td>
                        </tr>
                        <tr>
                        <td style={{border: '1px solid #dddddd', textAlign: 'left', padding: '8px 8px 8px 30px'}}>{'AED '}{order?.totalPrice}</td>
                        </tr>
                    </table>
                </CCol>
            </CRow>
            <CRow className='my-3'>
                <h5 className='mb-3'>Items</h5>
                <div class="col-lg-12 mx-auto">

                <ul class="list-group shadow">
                    {order?.items.map((item)=>{
                        return <li class="list-group-item">
                        <div class="media align-items-center justify-content-between d-flex flex-column flex-lg-row p-3">
                            <div class="ml-lg-5 col-md-2" style={{width:'6rem',height:'6rem',overflow:'hidden', background:`url(${item?.image?.src})`, backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat',border:'1px solid lightgray',borderRadius:'5px'}}>
                            </div>
                            <div class="col-md-10 media-body">
                                <h5 class="mt-0 font-weight-bold mb-2">{item.title}</h5>
                                <p class="font-italic text-muted mb-0 small">{item.title_option}</p>
                                <div class="d-flex align-items-center justify-content-between mt-1">
                                <h6 class="font-weight-bold my-2">AED {item.price}{' X '}{item.quantity}{' = '}{' AED '}{item.itemTotal}</h6>
                                </div>
                            </div>
                        </div>
                    </li>
                    })}

                </ul>
                </div>
            </CRow>
            <CRow className='my-3'>
                {order.fulfillment_status ? (
                    <button className='btn btn-dark text-white m-auto' style={{maxWidth:'10rem'}} disabled>Fulfilled</button>
                ) : (
                    <button className='btn btn-success text-white m-auto' onClick={(e)=>handleOrderFulfillment(order._id)} style={{maxWidth:'10rem'}}>Fulfill Items</button>
                )}
            </CRow>

    </CContainer>}
  </>
  )
}

export default View