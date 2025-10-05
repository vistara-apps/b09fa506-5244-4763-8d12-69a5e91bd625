'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold text-fg mb-4">
          Something went wrong!
        </h2>
        <p className="text-gray-400 mb-6">
          {error.message || 'An unexpected error occurred'}
        </p>
        <button
          onClick={reset}
          className="bg-accent text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-all duration-200"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
