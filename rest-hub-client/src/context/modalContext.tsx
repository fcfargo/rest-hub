'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

import { MODAL_TYPE } from '@/constants';

import PasswordChangeModal from '@/app/settings/components/passwordChangeModal';

interface ModalContextType {
  openModal: (modalType: ModalType) => void;
  closeModal: () => void;
}

type ModalType = (typeof MODAL_TYPE)[keyof typeof MODAL_TYPE];

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);

  const openModal = (modalType: ModalType) => setActiveModal(modalType);

  const closeModal = () => setActiveModal(null);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}

      {activeModal === MODAL_TYPE.PASSWORD_CHANGE && <PasswordChangeModal />}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
