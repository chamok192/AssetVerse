import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useMutation } from '@tanstack/react-query';
import { createPaymentIntent, confirmPayment } from '../Services/api';

const PaymentForm = ({ packageData, onSuccess, isLoading }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const createIntentMutation = useMutation({
    mutationFn: createPaymentIntent,
    onSuccess: async (result) => {
      if (result.success && result.data?.clientSecret) {
        await confirmPaymentHandler(result.data.clientSecret, result.data.paymentIntentId);
      } else {
        setCardError(result.error || 'Failed to create payment intent');
        setIsProcessing(false);
      }
    },
    onError: (err) => {
      setCardError(err?.message || 'Payment intent creation failed');
      setIsProcessing(false);
    }
  });

  const confirmPaymentHandler = async (clientSecret, paymentIntentId) => {
    if (!stripe || !elements) {
      setCardError('Stripe not initialized');
      setIsProcessing(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: { email: packageData.email }
      }
    });

    if (error) {
      setCardError(error.message);
      setIsProcessing(false);
    } else if (paymentIntent?.status === 'succeeded') {
      const confirmResult = await confirmPayment({
        paymentIntentId,
        packageId: packageData.packageId,
        amount: packageData.amount
      });

      if (confirmResult.success) {
        setCardError('');
        onSuccess();
      } else {
        setCardError(confirmResult.error || 'Failed to confirm payment');
      }
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCardError('');
    setIsProcessing(true);

    createIntentMutation.mutate({
      packageId: packageData.packageId,
      amount: packageData.amount,
      email: packageData.email
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">Card Details</span>
        </label>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                padding: '12px',
                '::placeholder': {
                  color: '#aab7c4'
                }
              },
              invalid: {
                color: '#fa755a'
              }
            }
          }}
          className="border border-gray-300 rounded-lg p-3 bg-white"
        />
      </div>

      {cardError && (
        <div className="alert alert-error mb-4">
          <span>{cardError}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing || isLoading}
        className="btn btn-primary w-full"
      >
        {isProcessing || isLoading ? (
          <>
            <span className="loading loading-spinner loading-sm"></span>
            Processing...
          </>
        ) : (
          `Pay $${packageData.amount}`
        )}
      </button>
    </form>
  );
};

export default PaymentForm;
