import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const sessionId = searchParams.get('sessionId');
    
    if (!sessionId) {
      return;
    }

    
    // The webhook will update the database in the background
    setTimeout(() => {
        navigate('/dashboard/payment-success');
      // Reload to fetch updated user data from backend
      setTimeout(() => window.location.reload(), 300);
    }, 2000);
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card bg-base-100 shadow-xl p-8 w-full max-w-md">
        <div className="space-y-4">
            <div className="text-center">
              <div className="text-5xl text-success mb-4">✓</div>
              <h1 className="text-2xl font-bold">Payment Successful!</h1>
            </div>
            <p className="text-center text-base-content/70">
              Your package has been upgraded successfully.
            </p>
            <p className="text-center text-sm text-base-content/50">
              Redirecting to your dashboard...
            </p>
            <div className="flex justify-center">
              <span className="loading loading-spinner loading-md"></span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
