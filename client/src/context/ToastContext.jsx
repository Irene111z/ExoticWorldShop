import { createContext, useState, useContext } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);

  const showToast = (msg) => {
    setMessage(msg);
    setVisible(true);
    setTimeout(() => setVisible(false), 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {visible && (
        <div
          className="toast show position-fixed top-0 end-0 m-3"
          style={{
            zIndex: 9999,
            minWidth: '200px',
            backgroundColor: 'rgba(255, 255, 255, 1)',
            boxShadow: '0 0.25rem 0.75rem rgba(0, 0, 0, 0.1)',
          }}
        >
          <div className="toast-header">
            <strong className="me-auto">Недостатньо доступу</strong>
            <button className="btn-close" onClick={() => setVisible(false)} />
          </div>
          <div className="toast-body">{message}</div>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
