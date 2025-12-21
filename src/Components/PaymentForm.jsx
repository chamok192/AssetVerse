import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createPaymentIntent } from '../Services/api';

const PaymentForm = ({ packageData, isLoading }) => {
  const [cardError, setCardError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const createCheckoutMutation = useMutation({
    mutationFn: createPaymentIntent,
    onSuccess: (result) => {
      if (result.success && result.data?.url) {
        // Redirect to Stripe
        window.location.href = result.data.url;
      } else {
        setCardError(result.error || 'Failed to create checkout session');
        setIsProcessing(false);
      }
    },
    onError: (err) => {
      setCardError(err?.message || 'Checkout creation failed');
      setIsProcessing(false);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCardError('');
    setIsProcessing(true);

    createCheckoutMutation.mutate({
      packageId: packageData.packageId,
      email: packageData.email
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-info bg-opacity-10 p-4 rounded-lg border border-info">
        <p className="text-sm text-base-content/80">
          You will be redirected to our secure payment processor to complete your purchase.
        </p>
      </div>

      {cardError && (
        <div className="alert alert-error alert-sm">
          <span className="text-sm">{cardError}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={isProcessing || isLoading}
        className="btn btn-primary w-full"
      >
        {isProcessing || isLoading ? (
          <>
            <span className="loading loading-spinner loading-sm"></span>
            Redirecting to payment...
          </>
        ) : (
          `Pay $${packageData.amount}`
        )}
      </button>
    </form>
  );
};

export default PaymentForm;
