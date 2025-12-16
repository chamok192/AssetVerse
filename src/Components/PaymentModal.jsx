import { useState } from 'react';
import PaymentForm from './PaymentForm';

const PaymentModal = ({ isOpen, onClose, package: pkg, userEmail, onSuccess }) => {
  const [step, setStep] = useState('confirm');

  if (!isOpen) return null;

  const handleSuccess = () => {
    onSuccess();
    setTimeout(() => setStep('confirm'), 500);
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box w-full max-w-md">
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle absolute right-2 top-2"
        >
          ✕
        </button>

        <h2 className="font-bold text-lg mb-4">Upgrade to {pkg.name}</h2>

        {step === 'confirm' && (
          <div className="space-y-4">
            <div className="bg-base-200 p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <span>Package</span>
                <span className="font-bold">{pkg.name}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Employee Limit</span>
                <span className="badge">{pkg.employeeLimit}</span>
              </div>
              <div className="divider my-2"></div>
              <div className="flex justify-between">
                <span className="font-bold">Amount</span>
                <span className="text-xl font-bold text-primary">${pkg.price}</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Features:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {pkg.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => setStep('payment')}
              className="btn btn-primary w-full"
            >
              Continue to Payment
            </button>
          </div>
        )}

        {step === 'payment' && (
          <div className="space-y-4">
            <div className="bg-info bg-opacity-20 p-3 rounded text-sm">
              Pay <strong>${pkg.price}</strong> for <strong>{pkg.name}</strong>
            </div>
            <PaymentForm
              packageData={{
                packageId: pkg.id,
                amount: pkg.price,
                email: userEmail
              }}
              onSuccess={handleSuccess}
              isLoading={false}
            />
            <button
              onClick={() => setStep('confirm')}
              className="btn btn-ghost w-full"
            >
              Back
            </button>
          </div>
        )}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </div>
  );
};

export default PaymentModal;
