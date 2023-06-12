import React from 'react'
import axios from '../axios'
import { useEffect,useState } from 'react';
import '../table.css';

export default function Orders({token,userid,tokentype}) {
  const [orders, setOrders] = useState([])
  const fetchData = async()=>{
    const response = await axios.get('/get-order',{
        params:{userid: userid},headers:{
            'Authorization': `Bearer ${token}`,
            'tokentype':tokentype
        }
    });
    setOrders(response.data.orders)
    
  }
  useEffect(()=>{
   if(token){
    fetchData(token);
   }
  },[]);


  return (
    <div>
      <h1>Order Details</h1>
      <table class="responstable">  
    <tr>
      <th>Title</th>
      <th>description</th>
      <th>UserID</th>
      <th>Phone Number</th>
      <th>Sub Total</th>
    </tr>
      {orders.map((order)=>(    
        <tr key={order._id}>
          <td>{order.title}</td>
          <td>{order.description}</td>
          <td>{order.userId}</td>
          <td>{order.phoneno}</td>
          <td>{order.sub_total}</td>
        </tr>
    ))}
    </table></div>
  )
}