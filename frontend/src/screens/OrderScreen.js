import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import { getOrderDetails } from '../actions/orderActions';
import Message from '../components/Message';
import Loader from '../components/Loader';

const OrderScreen = ({ match, history }) => {
   const [sdkReady, setSdkReady] = useState(false);

   const dispatch = useDispatch();

   const orderId = match.params.id;
   const orderDetails = useSelector(state => state.orderDetails);
   const { order, loading, error } = orderDetails;

   const orderPay = useSelector(state => state.orderPay);
   const { loading: loadingPay, success: successPay } = orderPay;

   const userLogin = useSelector(state => state.userLogin);
   const { userInfo } = userLogin;

   useEffect(() => {
      if (!userInfo) {
         history.push('/login');
      }

      const addPayPalScript = async () => {
         const { data: clientId } = await axios.get('/api/config/paypal');
         const script = document.createElement('script');
         script.type = 'text/javascript';
         script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
         script.async = true;
         script.onload = () => {
            setSdkReady(true);
         };
         document.body.appendChild(script);
      };

      if (!order || successPay) {
         dispatch(getOrderDetails(orderId));
      } else if (!order.isPaid) {
         if (!window.paypal) {
            addPayPalScript();
         } else {
            setSdkReady(true);
         }
      }
      // Test
      // if (!order || order._id !== orderId) {
      //    dispatch(getOrderDetails(orderId));
      // }
   }, [order, orderId, dispatch, successPay]);

   return loading ? (
      <Loader />
   ) : error ? (
      <Message variant='danger'>{error}</Message>
   ) : (
      <>
         <h1>Order id: {order._id}</h1>
         <Row>
            <Col md={8}>
               <ListGroup variant='flush'>
                  <ListGroup.Item>
                     <h2>Shipping</h2>
                     <p>
                        <strong>Name: </strong> {order.user.name}{' '}
                     </p>
                     <p>
                        <strong>Email: </strong>
                        <a href={`mailto:${order.user.email}`}>
                           {order.user.email}
                        </a>
                     </p>
                     <p>
                        <strong>Address: </strong>
                        {order.shippingAddress.address},{' '}
                        {order.shippingAddress.city},{' '}
                        {order.shippingAddress.postalCode},{' '}
                        {order.shippingAddress.country}
                     </p>
                     {order.isDelivered ? (
                        <Message variant='success'>
                           Delivered on {order.deliveredAt}
                        </Message>
                     ) : (
                        <Message variant='danger'>Not Delivered Yet</Message>
                     )}
                  </ListGroup.Item>
                  <ListGroup.Item>
                     <h2>Payment Method</h2>
                     <p>
                        <strong>Method: </strong>
                        {order.paymentMethod}
                     </p>
                     {order.isPaid ? (
                        <Message variant='success'>
                           Paid on {order.paidAt}
                        </Message>
                     ) : (
                        <Message variant='danger'>Not Paid</Message>
                     )}
                  </ListGroup.Item>
                  <ListGroup.Item>
                     <h2>Order Items</h2>
                     {order.orderItems.length === 0 ? (
                        <Message>Order is empty</Message>
                     ) : (
                        <ListGroup variant='flush'>
                           {order.orderItems.map((item, index) => (
                              <ListGroup.Item key={index}>
                                 <Row>
                                    <Col md={1}>
                                       <Image
                                          src={item.image}
                                          alt={item.name}
                                          fluid
                                          rounded
                                       />
                                    </Col>
                                    <Col>
                                       <Link to={`/product/${item.product}`}>
                                          {item.name}
                                       </Link>
                                    </Col>
                                    <Col md={4}>
                                       {item.qty} x €{item.price} = €
                                       {item.qty * item.price}
                                    </Col>
                                 </Row>
                              </ListGroup.Item>
                           ))}
                        </ListGroup>
                     )}
                  </ListGroup.Item>
               </ListGroup>
            </Col>
            <Col md={4}>
               <Card>
                  <ListGroup variant='flush'>
                     <ListGroup.Item>
                        <h2>Order Summary</h2>
                     </ListGroup.Item>
                     <ListGroup.Item>
                        <Row>
                           <Col>Items</Col>
                           <Col>
                              €{' '}
                              {Number(
                                 order.totalPrice -
                                    order.taxPrice -
                                    order.shippingPrice
                              )}
                           </Col>
                        </Row>
                        <Row>
                           <Col>Tax (21% btw)</Col>
                           <Col>€ {order.taxPrice}</Col>
                        </Row>
                     </ListGroup.Item>
                     <ListGroup.Item>
                        <Row>
                           <Col>Shipping</Col>
                           <Col>€ {order.shippingPrice}</Col>
                        </Row>
                     </ListGroup.Item>
                     <ListGroup.Item>
                        <Row>
                           <Col>
                              <strong>Total</strong>
                           </Col>
                           <Col>€ {order.totalPrice}</Col>
                        </Row>
                     </ListGroup.Item>
                  </ListGroup>
               </Card>
            </Col>
         </Row>
      </>
   );
};

export default OrderScreen;
