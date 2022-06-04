import React, { memo } from 'react';
import dayjs from 'dayjs';
import { OverlayTrigger, Popover } from 'react-bootstrap';

function PaymentHistory({ paymentsList }) {
  let total = 0;

  return (
    <table>
      <thead>
        <tr>
          <th>Type</th>
          <th>Card Type</th>
          <th>Date</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {paymentsList && paymentsList?.map((payment) => {
          total += Number(payment?.charges?.data?.[0]?.amount) / 100;
          return (
            <tr key={payment.charges?.data?.[0]?.id}>
              <td className="charge">Charge</td>
              <td>{`${payment.charges.data[0].payment_method_details.card.brand.toUpperCase()} ${payment.charges.data[0].payment_method_details.card.last4}`}</td>
              <td>{`${dayjs.unix(payment.charges?.data?.[0]?.created).format('YYYY-MM-DD HH:mm')}`}</td>
              <td>{`US$ ${(Number(payment?.charges?.data?.[0]?.amount) / 100).toFixed(2)}`}</td>
            </tr>
          );
        })}
        {paymentsList && paymentsList?.map((payment) => (
          payment.charges.data[0].refunds.data.map((refund) => {
            total -= Number(refund.amount / 100);
            return (
              <tr key={refund.id}>
                <OverlayTrigger
                  placement="right"
                  trigger={['hover', 'focus']}
                  overlay={(
                    <Popover>
                      <Popover.Header as="h3">Refund Reason</Popover.Header>
                      <Popover.Body>
                        {refund.metadata?.refund_reason || refund.reason || 'Reason was not specified'}
                      </Popover.Body>
                    </Popover>
                  )}
                >
                  <td className="refund">
                    Refund
                    <i className="fas fa-caret-down" />
                  </td>
                </OverlayTrigger>
                <td>{`${payment.charges.data[0].payment_method_details.card.brand.toUpperCase()} ${payment.charges.data[0].payment_method_details.card.last4}`}</td>
                <td>{`${dayjs.unix(refund.created).format('YYYY-MM-DD HH:mm')}`}</td>
                <td>{`US$ ${Number(refund.amount / 100).toFixed(2)}`}</td>
              </tr>
            );
          })
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan="5">{`Total: US$ ${Number(total).toFixed(2)}`}</td>
        </tr>
      </tfoot>
    </table>
  );
}

export default memo(PaymentHistory);
