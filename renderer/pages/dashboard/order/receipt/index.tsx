import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Order } from '@/models';

const OrderReceiptPage = () => {
  const [order, setOrder] = useState<Order>();

  const router = useRouter();

  useEffect(() => {
    const order = localStorage.getItem('order_to_print');
    setOrder(order ? JSON.parse(order) : undefined);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const goBack = () => {
    router.back();
  };

  return (
    <>
      {!order ? (
        <p>Order not found</p>
      ) : (
        <div>
          <button onClick={goBack}>Back</button>
          <div className="receipt">
            <h1 className="receipt-title">Quetta Cafe Receipt</h1>
            <p className="receipt-contact">Phone +92 300 123456789</p>
            <div className="receipt-header">
              <p>
                Order ID: <strong>{order.id}</strong>
              </p>
              <p>
                Date: <strong>{new Date(order.createdAt).toLocaleString()}</strong>
              </p>
            </div>

            <hr className="receipt-divider" />
            <h3 className="receipt-section-title">Items:</h3>
            <ul className="receipt-items-list">
              {order.items.map((item, index) => (
                <li key={index} className="receipt-item">
                  <span>
                    {item.quantity} x {item.menuItem.name}
                  </span>
                  <span style={{ textAlign: 'center' }}>{item.price.toFixed(2)} </span>
                  <span style={{ textAlign: 'right' }}>Rs. {(item.quantity * item.price).toFixed(2)}</span>
                </li>
              ))}
            </ul>

            <div className="receipt-summary">
              <h2>Total: PKR {order.totalAmount.toFixed(2)}</h2>
              {order.discount > 0 && <p>Discount: -{order.discount.toFixed(2)} PKR</p>}
              {order.tax > 0 && <p>Tax: +{order.tax.toFixed(2)}</p>}
              <h3>Final Amount: {(order.totalAmount - order.discount + order.tax).toFixed(2)} PKR</h3>
            </div>

            <hr className="receipt-divider" />
            <div className="receipt-footer">
              <p>Thank you for your purchase!</p>
              <p>Software provided by: Marifa Technologies LLC</p>
              <p>Contact us at: +92 305 3216942</p>
              <p>Website: www.marifatech.com</p>
            </div>
          </div>
          <button onClick={handlePrint}>Print Receipt</button>
        </div>
      )}
    </>
  );
};

export default OrderReceiptPage;
