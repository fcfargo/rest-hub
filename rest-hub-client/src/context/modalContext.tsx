'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

import PostCreateModal from '@/app/posts/create/postCreateModal';
import PasswordChangeModal from '@/app/settings/security/passwordChangeModal';
import { MODAL_TYPES } from '@/constants';

interface ModalContextType {
  openModal: (modalType: ModalType) => void;
  closeModal: () => void;
}

type ModalType = (typeof MODAL_TYPES)[keyof typeof MODAL_TYPES];

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);

  const openModal = (modalType: ModalType) => setActiveModal(modalType);

  const closeModal = () => setActiveModal(null);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}

      {activeModal === MODAL_TYPES.PASSWORD_CHANGE && <PasswordChangeModal />}
      {activeModal === MODAL_TYPES.POST_CREATE && <PostCreateModal />}
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
