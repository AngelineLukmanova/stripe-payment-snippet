import React, { useState } from 'react';
import dayjs from 'dayjs';
import {
  Accordion,
  Form,
  Button,
  InputGroup,
} from 'react-bootstrap';
import { useStripe } from '@stripe/react-stripe-js';
import fetchFromAPI from '../../../utils/helpers';
import { validPrice } from '../../../utils/Regex';

const date = dayjs(new Date()).format('YYYY-MM-DD');
const API = process.env.REACT_APP_STRIPE_API;

function ChargeExistingCard({
  setFormOpen,
}) {
  const [paymentOptions, setPaymentOptions] = useState('');
  const [cardId, setCardId] = useState('');
  const [amount, setAmount] = useState('');
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  const stripe = useStripe();

  const paymentList = async (body) => {
    const res = await fetchFromAPI(API, 'payment-options', {
      body,
    });
    setPaymentOptions(res);
  };

  if (localStorage.getItem('customerId') && paymentOptions === '') {
    const body = {
      customer: localStorage.getItem('customerId'),
    };
    paymentList(body);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidated(true);
    if (cardId && cardId !== 'default' && amount && Number(amount) > 0) {
      setProcessing(true);
      const body = {
        customer: localStorage.getItem('customerId'),
        amount: Number(amount) * 100,
      };
      let res;
      try {
        res = await fetchFromAPI(API, 'create-payment-intent', {
          body
        })
      } catch (err) {
        setError(`${err.message}. Error code is: ${err.code}`)
      }

      const payload = await stripe.confirmCardPayment(res.clientSecret, {
        payment_method: cardId,
      });
      if (payload.error) {
        setError(`Payment Failed: ${payload.error.message}`)
      } else {
        window.location.reload();
      }
    }
  };

  return (
    <div className="Payment__payment-info-form-existingCard">
      <Accordion.Item eventKey="1" onClick={() => setFormOpen('existing card')}>
        <Accordion.Header>
          Charge existing card
        </Accordion.Header>
        <Accordion.Body>
          {error && <div className="Payment__payment-info-form-error">{error}</div>}
          <div className="Payment__payment-info-form-existingCard-container">
            <div className="Payment__payment-info-form-existingCard-form">
              <Form onSubmit={(e) => handleSubmit(e)}>
                <InputGroup className="mb-3">
                  <InputGroup.Text>US$</InputGroup.Text>
                  <Form.Control
                    value={amount}
                    className={`${validated && amount && Number(amount) > 0 ? 'is-valid' : ''} ${validated && (!amount || Number(amount) <= 0) ? 'is-invalid' : ''}`}
                    type="text"
                    placeholder="Amount"
                    onChange={(e) => validPrice.test(e.target.value)
                      && setAmount(e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Amount cannot be 0 or less
                  </Form.Control.Feedback>
                </InputGroup>
                <Form.Group className="mb-3">
                  <Form.Select
                    value={cardId}
                    className={`${validated && cardId ? 'is-valid' : ''} ${validated && (!cardId || cardId === 'default') ? 'is-invalid' : ''}`}
                    aria-label="Select Payment Card"
                    onChange={(e) => setCardId(e.target.value)}
                  >
                    <option value="default">Payment Option</option>
                    {paymentOptions && paymentOptions.payments?.map((payment) => (
                      <option key={payment.id} value={payment.id}>
                        xxxxxxxxxxxx
                        {payment.card.last4}
                        {' '}
                        {payment.card.brand.charAt(0).toUpperCase() + payment.card.brand.slice(1)}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Choose payment option
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control
                    readOnly
                    type="date"
                    placeholder="yyyy-mm-dd"
                    defaultValue={date}
                  />
                  <Form.Text className="text-muted">
                    Transaction date
                  </Form.Text>
                </Form.Group>
                <div className="Payment__payment-info-form-buttons">
                  <Button type="submit" disabled={processing} onClick={(e) => handleSubmit(e)}>
                    {processing ? 'Processing...' : 'Charge'}
                  </Button>
                  <Button
                    type="button"
                    disabled={processing}
                    onClick={() => {
                      setValidated(false);
                      setAmount('');
                      setCardId('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </Accordion.Body>
      </Accordion.Item>
    </div>
  );
}

export default ChargeExistingCard;
