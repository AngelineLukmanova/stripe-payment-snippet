import React, { useState, useEffect } from 'react';
import { Accordion } from 'react-bootstrap';
import PaymentHistory from './PaymentHistory';
import fetchFromAPI from '../utils/helpers';
import ChargeExistingCard from './ChargeExistingCard';
import PaymentConfirmation from './PaymentConfirmation';
import ChargeNewCard from './ChargeNewCard';
import Refund from './Refund';
import './PaymentInfo.scss';

const API = process.env.STRIPE_API;

function Payment() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [formOpen, setFormOpen] = useState('refund');
  const [formMsg, setFormMsg] = useState('');
  const [paymentsList, setPaymentsList] = useState('');
  const [checked, setChecked] = useState(false);

  // const [customer, setCustomer] = useState(localStorage.getItem('customerId'));

  // console.log(localStorage.getItem('customerId'));
  // console.log(customer);


  // const paymentIntentsList = async (body) => {
  //   const res = await fetchFromAPI(API, 'create-payment-intents-list', {
  //     body,
  //   });
  //   setPaymentsList(res.paymentIntentsList.data);
  // };

  // useEffect(() => {
  //   if (clickedBooking) {
  //     const body = {
  //       customer: clickedBooking.customer.customerId,
  //     };
  //     paymentIntentsList(body);
  //   }
  // }, [clickedBooking]);

  return (
    <div className="Payment__payment-info">
      <h1>Stripe Demo</h1>
      <div className="Payment__payment-info-container">
        <PaymentHistory paymentsList={paymentsList} />
      </div>
      <div className="Payment__payment-info-forms">
        <Accordion defaultActiveKey="0">
          <Refund
            setShowConfirmation={setShowConfirmation}
            confirmed={confirmed}
            setFormOpen={setFormOpen}
            formOpen={formOpen}
            setFormMsg={setFormMsg}
            paymentsList={paymentsList}
            checked={checked}
          />
          <ChargeExistingCard
            setShowConfirmation={setShowConfirmation}
            confirmed={confirmed}
            setFormOpen={setFormOpen}
            formOpen={formOpen}
            setFormMsg={setFormMsg}
          />
          <ChargeNewCard
            setShowConfirmation={setShowConfirmation}
            confirmed={confirmed}
            setFormOpen={setFormOpen}
            formOpen={formOpen}
            setFormMsg={setFormMsg}
          />
        </Accordion>
      </div>
      <PaymentConfirmation
        showConfirmation={showConfirmation}
        setShowConfirmation={setShowConfirmation}
        setConfirmed={setConfirmed}
        formOpen={formOpen}
        formMsg={formMsg}
        checked={checked}
        setChecked={setChecked}
      />
    </div>
  );
}

export default Payment;
