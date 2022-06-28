import React, { useState, useEffect } from 'react';
import { Accordion } from 'react-bootstrap';
import PaymentHistory from './PaymentHistory';
import fetchFromAPI from '../utils/helpers';
import ChargeExistingCard from './ChargeExistingCard';
import PaymentConfirmation from './PaymentConfirmation';
import ChargeNewCard from './ChargeNewCard';
import Refund from './Refund';
import './PaymentInfo.scss';

const API = process.env.REACT_APP_STRIPE_API;

function Payment() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [formOpen, setFormOpen] = useState('refund');
  const [formMsg, setFormMsg] = useState('');
  const [paymentsList, setPaymentsList] = useState('');
  const [loading, setLoading] = useState(true);

  const paymentIntentsList = async (body) => {
    const res = await fetchFromAPI(API, 'create-payment-intents-list', {
      body,
    });
    setPaymentsList(res.paymentIntentsList.data.filter((payment) => payment.charges.data.length > 0));
    setLoading(false);
  };

  useEffect(() => {
    if (localStorage.getItem('customerId') && paymentsList === '') {
      const body = {
        customer: localStorage.getItem('customerId'),
      };
      paymentIntentsList(body);
    }
    else {
      setLoading(false);
    }
  }, [paymentsList]);

  return (
    <div className="Payment__payment-info">
      <h1>Stripe Demo</h1>
      {!loading
        ? (
          <div className="Payment__payment-info-container">
            <PaymentHistory paymentsList={paymentsList} />
          </div>)
        : <div className="spinner-border spinner-stripe" role="status" />
      }
      <div className="Payment__payment-info-forms">
        <Accordion>
          <Refund
            setShowConfirmation={setShowConfirmation}
            confirmed={confirmed}
            setFormOpen={setFormOpen}
            formOpen={formOpen}
            setFormMsg={setFormMsg}
            paymentsList={paymentsList}
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
      />
    </div>
  );
}

export default Payment;
