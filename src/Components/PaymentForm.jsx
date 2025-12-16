import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createPaymentIntent, confirmPayment } from '../Services/api';

const PaymentForm = ({ packageData, onSuccess, isLoading }) => {
  const [cardholderName, setCardholderName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiration, setExpiration] = useState('');
  const [cvc, setCvc] = useState('');
  const [country, setCountry] = useState('Bangladesh');
  const [cardError, setCardError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (userData.name) {
      setCardholderName(userData.name);
    }
  }, []);

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
    try {
      const confirmResult = await confirmPayment({
        paymentIntentId,
        packageId: packageData.packageId,
        amount: packageData.amount,
        phoneNumber: phoneNumber,
        cardholderName: cardholderName
      });

      if (confirmResult?.success) {
        setCardError('');
        setPhoneNumber('');
        setCardNumber('');
        setExpiration('');
        setCvc('');
        setCardholderName('');
        onSuccess();
      } else {
        const errorMsg = confirmResult?.error || 'Failed to confirm payment';
        setCardError(errorMsg);
      }
    } catch (error) {
      setCardError(error?.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = value.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  const handleExpirationChange = (e) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    setExpiration(value);
  };

  const handleCvcChange = (e) => {
    setCvc(e.target.value.replace(/\D/g, '').slice(0, 4));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCardError('');
    
    if (!cardholderName.trim()) {
      setCardError('Cardholder name is required');
      return;
    }

    if (!phoneNumber.trim()) {
      setCardError('Phone number is required');
      return;
    }

    if (!cardNumber.replace(/\s/g, '').trim() || cardNumber.replace(/\s/g, '').length < 13) {
      setCardError('Valid card number is required');
      return;
    }

    if (!expiration.trim() || expiration.length < 5) {
      setCardError('Valid expiration date is required (MM/YY)');
      return;
    }

    if (!cvc.trim() || cvc.length < 3) {
      setCardError('Valid CVC is required');
      return;
    }
    
    setIsProcessing(true);

    createIntentMutation.mutate({
      packageId: packageData.packageId,
      amount: packageData.amount,
      email: packageData.email,
      phoneNumber: phoneNumber
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="form-control">
        <label className="label">
          <span className="label-text text-sm font-semibold">Cardholder Name</span>
        </label>
        <input
          type="text"
          placeholder="Enter cardholder name"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          autoComplete="off"
          className="input input-bordered input-sm w-full"
          required
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text text-sm font-semibold">Phone Number</span>
        </label>
        <input
          type="tel"
          placeholder="Enter your phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          autoComplete="off"
          className="input input-bordered input-sm w-full"
          required
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text text-sm font-semibold">Stripe Credit Card</span>
        </label>
        
        <div className="form-control">
          <label className="label">
            <span className="label-text text-xs">Card number</span>
          </label>
          <input
            inputMode="numeric"
            placeholder="1234 1234 1234 1234"
            value={cardNumber}
            onChange={handleCardNumberChange}
            autoComplete="off"
            spellCheck="false"
            data-lpignore="true"
            className="input input-bordered input-sm w-full"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3 mt-3">
          <div className="form-control">
            <label className="label">
              <span className="label-text text-xs">Expiration</span>
            </label>
            <input
              type="text"
              placeholder="MM / YY"
              value={expiration}
              onChange={handleExpirationChange}
              autoComplete="off"
              className="input input-bordered input-sm w-full"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-xs">CVC</span>
            </label>
            <input
              type="text"
              placeholder="CVC"
              value={cvc}
              onChange={handleCvcChange}
              autoComplete="off"
              className="input input-bordered input-sm w-full"
              required
            />
          </div>
        </div>

        <div className="form-control mt-3">
          <label className="label">
            <span className="label-text text-xs">Country</span>
          </label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="select select-bordered select-sm w-full"
          >
            <option>Bangladesh</option>
            <option>United States</option>
            <option>Canada</option>
            <option>United Kingdom</option>
            <option>Australia</option>
            <option>Other</option>
          </select>
        </div>
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
