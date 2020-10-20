import React, { useState, useEffect } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import { savePaymentMethod } from '../actions/cartActions';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';

const PaymentScreen = ({ history }) => {
   const cart = useSelector(state => state.cart);
   const { shippingAddress } = cart;

   if (!shippingAddress) {
      history.push('/shipping');
   }

   const [paymentMethod, setPaymentMethod] = useState('PayPal');

   const dispatch = useDispatch();

   useEffect(() => {}, [paymentMethod]);

   const submitHandler = e => {
      e.preventDefault();
      dispatch(savePaymentMethod(paymentMethod));
      history.push('/placeorder');
   };

   return (
      <FormContainer>
         <CheckoutSteps step1 step2 step3 />
         <h1>Payment Method</h1>
         <Form onSubmit={submitHandler}>
            <Form.Group>
               <Form.Label as='legend'>Select Method</Form.Label>
               <Col>
                  <Form.Check
                     type='radio'
                     label='PayPal, Credit Card or IDEAL'
                     id='PayPal'
                     name='paymentMethod'
                     value='PayPal'
                     defaultChecked
                     onChange={e => setPaymentMethod(e.target.value)}
                  ></Form.Check>
                  {/* <Form.Check
                     type='radio'
                     label='Bitcoin'
                     id='Bitcoin'
                     name='paymentMethod'
                     value='Bitcoin'
                     onChange={e => {
                        setPaymentMethod(e.target.value);
                     }}
                  ></Form.Check> */}
               </Col>
            </Form.Group>
            <Button type='submit' variant='primary'>
               Continue
            </Button>
         </Form>
      </FormContainer>
   );
};

export default PaymentScreen;
