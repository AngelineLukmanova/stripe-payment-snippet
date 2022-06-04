import React, { useState, useEffect } from 'react';
import { Accordion } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
// import { ADD_TRANSACTION } from '../../../../api/bookings';
import PaymentHistory from './PaymentHistory';
import fetchFromAPI from '../utils/helpers';
import ChargeExistingCard from './ChargeExistingCard';
import PaymentConfirmation from './PaymentConfirmation';
import Refund from './Refund';
import './PaymentInfo.scss';

const API = process.env.REACT_APP_BOAT_API;

function Payment({ clickedBooking }) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [formOpen, setFormOpen] = useState('new card');
  const [formMsg, setFormMsg] = useState('');
  const [paymentsList, setPaymentsList] = useState('');
  const [checked, setChecked] = useState(false);

  // const [addTransaction] = useMutation(ADD_TRANSACTION, {
  //   onCompleted: () => {
  //     setShowConfirmation(false);
  //     !checked && window.location.reload();
  //   },
  // });

  const paymentIntentsList = async (body) => {
    const res = await fetchFromAPI(API, 'create-payment-intents-list', {
      body,
    });
    setPaymentsList(res.paymentIntentsList.data);
  };

  useEffect(() => {
    if (clickedBooking) {
      const body = {
        customer: clickedBooking.customer.customerId,
      };
      paymentIntentsList(body);
    }
  }, [clickedBooking]);

  return (
    <div className="BookingModal__payment-info">
      <div className="BookingModal__payment-info-container">
        <PaymentHistory clickedBooking={clickedBooking} paymentsList={paymentsList} />
      </div>
      <div className="BookingModal__payment-info-forms">
        <Accordion defaultActiveKey="2">
          <Refund
            clickedBooking={clickedBooking}
            setShowConfirmation={setShowConfirmation}
            confirmed={confirmed}
            // addTransaction={addTransaction}
            setFormOpen={setFormOpen}
            formOpen={formOpen}
            setFormMsg={setFormMsg}
            paymentsList={paymentsList}
            checked={checked}
          />
          <ChargeExistingCard
            clickedBooking={clickedBooking}
            setShowConfirmation={setShowConfirmation}
            confirmed={confirmed}
            // addTransaction={addTransaction}
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
        clickedBooking={clickedBooking}
        checked={checked}
        setChecked={setChecked}
      />
    </div>
  );
}

export default Payment;
