'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

import PostCreateModal from '@/app/posts/create/postCreateModal';
import PostDeleteModal from '@/app/posts/delete/postDeleteModal';
import PostDetailModal from '@/app/posts/detail/postDetailModal';
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
};

type PostDelete = {
  postId: string;
};

type PostDetail = {
  post: Post;
};

type ModalDataMap = {
  [MODAL_TYPES.POST_CREATE]: undefined;
  [MODAL_TYPES.PASSWORD_CHANGE]: undefined;
  [MODAL_TYPES.POST_UPDATE]: PostUpdate;
  [MODAL_TYPES.POST_DELETE]: PostDelete;
  [MODAL_TYPES.POST_DETAIL]: PostDetail;
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
    // 파라미터를 (data?)로 설정하면, 모달 창을 열 때 data 값을 넘기지 않아도 error 검출이 안된다.
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
      {activeModal === MODAL_TYPES.POST_UPDATE && data && <PostUpdateModal post={data.post} />}
      {activeModal === MODAL_TYPES.POST_DELETE && data && <PostDeleteModal postId={data.postId} />}
      {activeModal === MODAL_TYPES.POST_DETAIL && data && <PostDetailModal post={data.post} />}
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
