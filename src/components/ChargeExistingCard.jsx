import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { useStripe } from '@stripe/react-stripe-js';
import {
  Accordion,
  Form,
  Button,
  InputGroup,
} from 'react-bootstrap';
import fetchFromAPI from '../utils/helpers';
import { validPrice } from '../utils/Regex';

const date = dayjs(new Date()).format('YYYY-MM-DD');
const API = process.env.REACT_APP_STRIPE_API;

function ChargeExistingCard({
  clickedBooking,
  addTransaction,
  setShowConfirmation,
  confirmed,
  formOpen,
  setFormOpen,
  setFormMsg,
}) {
  const [paymentOptions, setPaymentOptions] = useState();
  const [cardId, setCardId] = useState('');
  const [amount, setAmount] = useState('');
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState('');
  const stripe = useStripe();

  const cardInfo = (cardId && cardId !== 'default')
    && paymentOptions.payments.filter((payment) => payment.id === cardId)[0];

  useEffect(() => {
    if (clickedBooking) {
      const body = {
        customer: clickedBooking.customer.customerId,
      };
      const paymentList = async () => {
        const res = await fetchFromAPI(API, 'payment-options', {
          body,
        });
        setPaymentOptions(res);
      };
      paymentList();
    }
  }, [clickedBooking]);

  useEffect(() => {
    if (confirmed && validated && formOpen === 'existing card') {
      try {
        const body = {
          customer: clickedBooking.customer.customerId,
          amount: Number(amount) * 100,
          paymentMethodId: cardId,
        };
        const paymentIntent = async () => {
          const res = await fetchFromAPI(API, 'create-payment-intent', {
            body,
          });
          res && stripe.retrievePaymentIntent(res.clientSecret).then(({ paymentIntent }) => {
            addTransaction({
              variables: {
                input: {
                  stripe_id: paymentIntent.id,
                  date,
                  card_type: cardInfo.card.brand,
                  value: amount,
                  card_value: cardInfo.card.last4,
                  type: 'charge',
                  customer_id: clickedBooking.customer.customerId,
                  booking_id: clickedBooking.id,
                  payment_method: cardId,
                },
              },
            });
            window.location.reload();
          });
        };
        paymentIntent();
      } catch (err) {
        setError(`Payment Failed: ${err.message}. Error code is: ${err.code}`);
      }
    }
  }, [confirmed, validated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidated(true);
    setFormMsg(
      <>
        <div>{`You are about to create a charge amount of $${Number(amount).toFixed(2)} to the following card:`}</div>
        <div>{`XXXXXXXXXXXX${cardInfo.card.last4} ${cardInfo.card.brand.toUpperCase()}`}</div>
        <div>Are you sure you want to make this charge?</div>
      </>,
    );
    if (cardId && cardId !== 'default' && amount && Number(amount) > 0) {
      setShowConfirmation(true);
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
                  <Button type="submit" disabled={confirmed}>
                    Charge
                  </Button>
                  <Button
                    type="button"
                    disabled={confirmed}
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
