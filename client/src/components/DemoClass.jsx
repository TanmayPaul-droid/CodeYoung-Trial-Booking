
import React from 'react';

export default function DemoClass() {
  const params = new URLSearchParams(window.location.search);
  const bookingId = params.get('bookingId') || 'DEMO-CLASS';

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-2xl bg-white p-8 text-center shadow-lg">
        <div className="mb-4 text-5xl">🎉</div>

        <h1 className="mb-3 text-3xl font-bold text-slate-900">
          Welcome to Your Trial Class!
        </h1>

        <p className="mb-6 text-slate-600">
          Your booking is confirmed. This is the demo classroom
          page for the CodeYoung Trial Booking System.
        </p>

        <div className="rounded-xl bg-green-50 p-4 text-left">
          <p className="font-semibold text-green-800">
            Booking Reference
          </p>
          <p className="mt-1 break-all text-slate-700">
            {bookingId}
          </p>
        </div>

        <p className="mt-6 text-sm text-slate-500">
          This is a simulated classroom. Live video conferencing
          is not enabled.
        </p>

        <a
          href="/"
          className="mt-6 inline-block rounded-full bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
}
