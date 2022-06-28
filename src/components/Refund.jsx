import React, { useState } from 'react';
import dayjs from 'dayjs';
import {
  Accordion,
  Form,
  InputGroup,
  Button,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import fetchFromAPI from '../utils/helpers';
import { validTextArea, validPrice } from '../utils/Regex';

const API = process.env.REACT_APP_STRIPE_API;

function Refund({
  setShowConfirmation,
  setFormMsg,
  confirmed,
  formOpen,
  setFormOpen,
  paymentsList,
}) {
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [paymentValue, setPaymentValue] = useState('');
  const [paymentIntent, setPaymentIntent] = useState('');
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState('');

  const payment = paymentsList && paymentsList?.filter((payment) => payment.id === paymentIntent);
  const cardInfo = payment?.[0]?.charges?.data?.[0]?.payment_method_details.card;

  const createRefund = async (body) => {
    try {
      const res = await fetchFromAPI(API, 'create-refund', {
        body,
      });
      if (res.refund) window.location.reload();
    } catch (err) {
      setError(`Refund failed: ${err.message}. Error code is: ${err.code}`)
    }
  };

  if (confirmed && validated && formOpen === 'refund') {
    try {
      const body = {
        paymentIntent,
        amount: Number(amount) * 100,
        reason: reason.replace(/\s+/g, ' ').trim(),
      };
      createRefund(body);
    } catch (err) {
      setError(`Payment Failed: ${err.message}. Error code is: ${err.code}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidated(true);
    if (Number(amount) > 0
      && Number(amount) <= Number(paymentValue)
      && validTextArea.test(reason)
      && paymentIntent
    ) {
      setShowConfirmation(true);
      setFormMsg(
        <>
          <div>{`You are about to issue a refund amount of $${Number(amount).toFixed(2)} to the following card:`}</div>
          <div>{`XXXXXXXXXXXX${cardInfo?.last4} ${cardInfo?.brand.toUpperCase()}`}</div>
          <div>Are you sure you want to make this refund?</div>
          <br />
        </>,
      );
    }
  };

  const handleAmountChange = (e, payment) => {
    const amountValue = payment.charges.data[0]?.amount_refunded
      ? ((Number(payment.charges.data[0]?.amount)
        - Number(payment.charges.data[0]?.amount_refunded)) / 100)
      : Number(e.target.value) / 100;
    setAmount(amountValue);
    setPaymentValue(amountValue);
    setPaymentIntent(e.target.id);
  };

  return (
    <div className="Payment__payment-info-form-refund">
      <Accordion.Item eventKey="0" onClick={() => setFormOpen('refund')}>
        <Accordion.Header>
          Refund
        </Accordion.Header>
        <Accordion.Body>
          {error && <div className="Payment__payment-info-form-error">{error}</div>}
          <Form onSubmit={(e) => handleSubmit(e)}>
            <div className="Payment__payment-info-form-refund-header">
              Choose payment to refund:
            </div>
            <Form.Group className="Payment__payment-info-form-refund-radioBtn mb-3 ">
              {paymentsList && paymentsList.map((payment) => (
                payment.charges.data[0] && !payment.charges.data[0].refunded)
                && (
                  <div className="Payment__payment-info-form-refund-payments" key={payment.id}>
                    <Form.Check
                      type="radio"
                      name="payments-radio-btn"
                      key={payment.id}
                      id={payment.id}
                      value={payment.amount}
                      className={`Payment__payment-info-form-checkbox${validated && paymentIntent ? ' is-valid' : ''}${validated && !paymentIntent ? ' is-invalid' : ''}`}
                      onChange={(e) => handleAmountChange(e, payment)}
                    />
                    <Form.Check.Label>
                      {payment.charges.data[0]?.refunds.data[0]
                        ? (
                          <OverlayTrigger overlay={(
                            <Tooltip>
                              <div>{`$${Number(payment.charges.data[0]?.amount_refunded) / 100} was refunded`}</div>
                              <div>{`$${(Number(payment.charges.data[0]?.amount) - Number(payment.charges.data[0]?.amount_refunded)) / 100} remaining`}</div>
                            </Tooltip>
                          )}
                          >
                            <div className="partialRefund">
                              $
                              {(payment.amount / 100).toFixed(2)}
                            </div>
                          </OverlayTrigger>
                        )
                        : (
                          <div>
                            $
                            {(payment.amount / 100).toFixed(2)}
                          </div>
                        )}
                      <div>
                        USD
                      </div>
                      <div>
                        {payment.charges.data[0]?.payment_method_details.card.brand.toUpperCase()}
                      </div>
                      <div>
                        {payment.charges.data[0]?.payment_method_details.card.last4}
                      </div>
                      <div>
                        {dayjs(payment.charges.created).format('MMM D YYYY')}
                      </div>
                    </Form.Check.Label>
                  </div>
                ))}
            </Form.Group>
            <div className="Payment__payment-info-form-refund-inputs">
              <InputGroup className="mb-3">
                <InputGroup.Text>US$</InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Amount"
                  value={amount}
                  disabled={!paymentIntent}
                  className={`
                  ${validated && amount && Number(amount) > 0
                      && Number(amount) < Number(paymentValue) ? 'is-valid' : ''}
                  ${validated && (!amount || Number(amount) <= 0
                      || Number(amount) > Number(paymentValue)) ? 'is-invalid' : ''}`}
                  onChange={(e) => {
                    if (validPrice.test(e.target.value)) {
                      setAmount(e.target.value);
                    }
                  }}
                />
                <Form.Control.Feedback type="invalid">
                  Amount cannot be 0 or exceed remaining amount
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  Change amount for full or partual refund
                </Form.Text>
              </InputGroup>
              <Form.Group className="mb-3">
                <Form.Control
                  className={`
                 ${validated && validTextArea.test(reason) ? 'is-valid' : ''}
                 ${validated && !validTextArea.test(reason) ? 'is-invalid' : ''}`}
                  value={reason}
                  as="textarea"
                  rows={3}
                  maxLength="60"
                  onChange={(e) => setReason(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  Reason cannot be empty
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  Enter reason for refund
                </Form.Text>
              </Form.Group>
              <div className="Payment__payment-info-form-buttons">
                <Button type="submit" disabled={confirmed}>
                  Refund
                </Button>
                <Button
                  type="button"
                  disabled={confirmed}
                  onClick={() => {
                    setValidated(false);
                    setAmount('');
                    setReason('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Form>
        </Accordion.Body>
      </Accordion.Item>
    </div>
  );
}

export default Refund;
