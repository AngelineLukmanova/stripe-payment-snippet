import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function PaymentConfirmation({
  showConfirmation,
  setShowConfirmation,
  setConfirmed,
  formOpen,
  formMsg,
}) {
  let btn = 'Confirm Charge';

  if (formOpen === 'refund') {
    btn = 'Confirm Refund';
  }

  const handleClick = () => {
    setConfirmed(true);
    setShowConfirmation(false);
  };

  const handleClose = () => setShowConfirmation(false);

  return (
    <div>
      <Modal show={showConfirmation} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            Confirm transaction
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="Payment__payment-confirmation">
            {formMsg}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => handleClick()}>
            {btn}
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default PaymentConfirmation;
