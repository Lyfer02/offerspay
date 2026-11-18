// src/utils/modalService.js
import React, { createContext, useContext, useState, useRef } from 'react';
import ErrorModal from '../../components/ErrorModal';


const ModalContext = createContext();

let showModal = () => {};
let hideModal = () => {};

export const ModalProvider = ({ children }) => {
  const [config, setConfig] = useState(null);
  const timerRef = useRef(null);

  showModal = (newConfig) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setConfig(newConfig);
  };

  hideModal = () => {
    setConfig(null);
  };

  const handleClose = () => {
    config?.onClose?.();
    hideModal();
  };

  const handleConfirm = () => {
    config?.onConfirm?.();
    hideModal();
  };

  return (
    <ModalContext.Provider value={null}>
      {children}
      <ErrorModal
        visible={!!config}
        message={config?.message || ''}
        title={config?.title || 'Alert'}
        type={config?.type || 'info'}
        showCancel={config?.showCancel ?? true}
        confirmText={config?.confirmText || 'OK'}
        cancelText={config?.cancelText || 'Cancel'}
        onClose={handleClose}
        onConfirm={handleConfirm}
      />
    </ModalContext.Provider>
  );
};

// Export service
export const ErrorModalService = {
  success: (message, opts = {}) => showModal({ type: 'success', message, title: 'Success', showCancel: false, ...opts }),
  error: (message, opts = {}) => showModal({ type: 'error', message, title: 'Error', ...opts }),
  warning: (message, opts = {}) => showModal({ type: 'warning', message, title: 'Warning', ...opts }),
  info: (message, opts = {}) => showModal({ type: 'info', message, title: 'Info', ...opts }),
  hide: () => hideModal(),
};