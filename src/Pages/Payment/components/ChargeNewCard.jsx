import React, { useState, useEffect } from 'react';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Accordion, Button } from 'react-bootstrap';
import fetchFromAPI from '../../../utils/helpers';

const API = process.env.REACT_APP_STRIPE_API;

function ChargeNewCard({
  formOpen,
  setFormOpen,
}) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [clientSecret, setClientSecret] = useState(null);

  const elements = useElements();
  const stripe = useStripe();

  const getClientSecret = async (body) => {
    try {
      const res = await fetchFromAPI(API, 'create-payment-intent', {
        body
      })
      setClientSecret(res.clientSecret);
      if (!localStorage.getItem('customerId')) localStorage.setItem('customerId', res.customer);
    } catch (err) {
      setError(`${err.message}. Error code is: ${err.code}`)
    }
  };

  const addPaymentMethod = async (body) => {
    try {
      const res = await fetchFromAPI(API, 'add-payment-method', {
        body
      })
      if (res.newPaymentMethod) window.location.reload();
    } catch (err) {
      setError(`Payment method was not added: ${err.message}. Error code is: ${err.code}`)
    }
  };

  useEffect(() => {
    if (formOpen === 'new card') {
      const body = {
        amount: 10000,
        customer: localStorage.getItem('customerId'),
      }
      getClientSecret(body);
    }
  }, [formOpen]);

  const handleSubmit = async () => {
    setProcessing(true);
    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardNumberElement),
      },
      setup_future_usage: 'off_session',
    });

    if (payload.error) {
      setError(`Payment Failed: ${payload.error.message}`)
    } else {
      setProcessing(false);
      addPaymentMethod({
        paymentMethod: payload.paymentIntent.payment_method,
        customer: localStorage.getItem('customerId')
      });
    }
  };

  const handleChange = (e) => {
    const { error } = e;
    if (error) setError(error.message);
  };

  const cardStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
        fontSize: "14px",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  return (
    <div className="Payment__payment-info-form-newCard">
      <Accordion.Item eventKey="2" onClick={() => setFormOpen('new card')}>
        <Accordion.Header>
          Charge new card
        </Accordion.Header>
        <Accordion.Body>
          <div className="Payment__payment-info-form-newCard-elements">
            <div className="Payment__payment-info-form-newCard-elements-test">
              <p>Test card number is 4242 4242 4242 4242</p>
              <p>Use it with any CVC and future expiration date</p>
            </div>
            {error
              && (
                <div className="Payment__payment-info-form-newCard-elements-error">{error}</div>
              )}
            <p>Amount: 100$</p>
            <CardNumberElement
              options={cardStyle}
              onChange={handleChange}
            />
            <div className="Payment__payment-info-form-newCard-elements-cvc">
              <CardExpiryElement
                options={cardStyle}
                onChange={handleChange}
              />
              <CardCvcElement
                options={cardStyle}
                onChange={handleChange}
              />
            </div>
          </div>
          <Button
            id="new-card-charge-btn"
            type="button"
            disabled={processing}
            onClick={() => handleSubmit()}
          >
            {processing ? 'Processing...' : 'Charge'}
          </Button>
        </Accordion.Body>
      </Accordion.Item>
    </div>
  );
}

export default ChargeNewCard;
