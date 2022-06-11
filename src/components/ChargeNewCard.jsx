import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import {
  Accordion,
  Form,
  Button,
  InputGroup,
} from 'react-bootstrap';
import fetchFromAPI from '../utils/helpers';
import { validPrice } from '../utils/Regex';

const date = dayjs(new Date()).format('YYYY-MM-DD');
// const API = process.env.REACT_APP_STRIPE_API;

function ChargeNewCard({
  clickedBooking,
  addTransaction,
  setShowConfirmation,
  confirmed,
  formOpen,
  setFormOpen,
  setFormMsg,
}) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [amount, setAmount] = useState(100);
  const [clientSecret, setClientSecret] = useState(null);

  const elements = useElements();
  const stripe = useStripe();

  const [paymentOptions, setPaymentOptions] = useState();
  const [cardId, setCardId] = useState('');
  const [validated, setValidated] = useState(false);


  const cardInfo = (cardId && cardId !== 'default')
    && paymentOptions.payments.filter((payment) => payment.id === cardId)[0];

  const getClientSecret = async (body) => {
    const res = await fetchFromAPI(process.env.REACT_APP_STRIPE_API, 'create-payment-intent', {
      body
    })
    console.log(res);
  }

  useEffect(() => {
    if (formOpen === 'new card') {
      const body = {
        amount: 10000
      }
      getClientSecret(body);
    }
  }, [formOpen]);

  const handleSubmit = async () => {
    if (amount !== 0 && validPrice.test(amount)) {
      console.log('valid');
    } else {
      setError('Amount cannot be 0 or less');
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
            <p>Amount: 100$</p>
            <CardNumberElement
              options={cardStyle}
              onChange={handleChange}
            />
            <CardExpiryElement
              options={cardStyle}
              onChange={handleChange}
            />
            <CardCvcElement
              options={cardStyle}
              onChange={handleChange}
            />
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
