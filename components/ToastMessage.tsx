type ToastMessageProps = {
  message: string | null;
};

const ToastMessage = ({ message }: ToastMessageProps) => {
  if (!message) return null;

  return (
    <div className="toast-message">
      {message}
    </div>
  );
};

export default ToastMessage;
