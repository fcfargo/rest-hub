'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

import PostCreateModal from '@/app/posts/create/postCreateModal';
import PostDeleteModal from '@/app/posts/delete/postDeleteModal';
import PostUpdateModal from '@/app/posts/update/postUpdateModal';
import PasswordChangeModal from '@/app/settings/security/passwordChangeModal';
import { MODAL_TYPES } from '@/constants';
import { Post } from '@/types';

/**
 * 열 수 있는 모달 타입들의 유니언 타입
 */
type ModalType = (typeof MODAL_TYPES)[keyof typeof MODAL_TYPES];

type PostUpdate = {
  post: Post;
  onPostUpdated: (updatedPost: Post) => void;
};

type PostDelete = {
  postId: string;
  onPostDeleted: (deletedPostId: string) => void;
};

type ModalDataMap = {
  [MODAL_TYPES.POST_CREATE]: undefined;
  [MODAL_TYPES.PASSWORD_CHANGE]: undefined;
  [MODAL_TYPES.POST_UPDATE]: PostUpdate;
  [MODAL_TYPES.POST_DELETE]: PostDelete;
};

/**
 * 모달 타입별로 전달받는 데이터 타입 매핑
 */
interface ModalContextType {
  openModal: <T extends ModalType>(
    modalType: T,
    ...args: ModalDataMap[T] extends undefined ? [] : [ModalDataMap[T]]
  ) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);
  const [data, setData] = useState<any>(null);

  /**
   * 모달 열기 함수
   * @template T 모달 타입
   * @param modalType 모달 종류
   * @param args 모달에 전달할 데이터 (필요한 경우)
   */
  const openModal = <T extends ModalType>(
    modalType: T,
    ...args: ModalDataMap[T] extends undefined ? [] : [ModalDataMap[T]]
  ) => {
    const data = (args[0] || null) as ModalDataMap[T];

    setActiveModal(modalType);
    setData(data);
  };

  /**
   * 모달 닫기 함수
   */
  const closeModal = () => {
    setActiveModal(null);
    setData(null);
  };
  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {activeModal === MODAL_TYPES.PASSWORD_CHANGE && <PasswordChangeModal />}
      {activeModal === MODAL_TYPES.POST_CREATE && <PostCreateModal />}
      {activeModal === MODAL_TYPES.POST_UPDATE && data && (
        <PostUpdateModal post={data.post} onPostUpdated={data.onPostUpdated} />
      )}
      {activeModal === MODAL_TYPES.POST_DELETE && data && (
        <PostDeleteModal postId={data.postId} onPostDeleted={data.onPostDeleted} />
      )}
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
