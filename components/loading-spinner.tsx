import { FaSpinner } from 'react-icons/fa';

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <FaSpinner className="animate-spin text-white mr-3" />
      <span className="text-white">Loading...</span>
    </div>
  );
}

export default LoadingSpinner