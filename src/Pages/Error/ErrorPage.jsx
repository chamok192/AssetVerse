import React from 'react';
import { Link } from 'react-router';

const ErrorPage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 text-base-content px-6 text-center gap-6">
            <img
                src="https://static.vecteezy.com/system/resources/thumbnails/067/349/627/small/system-error-message-line-circle-inverted-vector.jpg"
                alt="Error"
                className="max-w-full rounded-lg shadow-lg"
            />
            <div className="space-y-3">
                <h1 className="text-3xl font-bold">Something went wrong</h1>
                <p className="text-sm sm:text-base max-w-xl mx-auto">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
                <div className="flex items-center justify-center gap-3">
                    <Link to="/" className="btn btn-neutral">Back to Home</Link>
                    <button type="button" onClick={() => window.location.reload()} className="btn btn-outline">Reload</button>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;
