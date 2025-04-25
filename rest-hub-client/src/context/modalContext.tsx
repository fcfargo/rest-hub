'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

import PostCreateModal from '@/app/posts/create/postCreateModal';
import PostDeleteModal from '@/app/posts/delete/postDeleteModal';
import CommentDeleteModal from '@/app/posts/detail/\bcomment/CommentDeleteModal';
import CommentReplyDeleteModal from '@/app/posts/detail/\bcomment/CommentReplyDeleteModal';
import PostDetailModal from '@/app/posts/detail/postDetailModal';
import PostUpdateModal from '@/app/posts/update/postUpdateModal';
import PasswordChangeModal from '@/app/settings/security/passwordChangeModal';
import UnfollowModal from '@/components/follow/UnfollowModal';
import { MODAL_TYPES } from '@/constants';
import { Post } from '@/types';

/**
 * 열 수 있는 모달 타입들의 유니언 타입
 */
type ModalType = (typeof MODAL_TYPES)[keyof typeof MODAL_TYPES];

type ModalInstance = {
  type: ModalType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
};

type PostUpdate = {
  post: Post;
};

type PostDelete = {
  postId: string;
};

type PostDetail = {
  postId: string;
};

type CommentDelete = {
  postId: string;
  commentId: string;
  deleteComment: (commentId: string) => void;
};

type CommentReplyDelete = {
  postId: string;
  parentId: string;
  replyId: string;
  deleteCommentReply: (replyId: string) => void;
  updateCommentRepliesCount: (commentId: string, repliesCount: number) => void;
};

type FollowDelete = {
  targetUserId: number;
};

type ModalDataMap = {
  [MODAL_TYPES.POST_CREATE]: undefined;
  [MODAL_TYPES.PASSWORD_CHANGE]: undefined;
  [MODAL_TYPES.POST_UPDATE]: PostUpdate;
  [MODAL_TYPES.POST_DELETE]: PostDelete;
  [MODAL_TYPES.POST_DETAIL]: PostDetail;
  [MODAL_TYPES.COMMENT_DELETE]: CommentDelete;
  [MODAL_TYPES.COMMENT_REPLY_DELETE]: CommentReplyDelete;
  [MODAL_TYPES.UNFOLLOW_USER]: FollowDelete;
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
  const [modalStack, setModalStack] = useState<ModalInstance[]>([]);

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
    setModalStack((prev) => [...prev, { type: modalType, data }]);
  };

  /**
   * 모달 닫기 함수
   */
  const closeModal = () => {
    setModalStack((prev) => prev.slice(0, -1));
  };
  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}

      {modalStack.map((modal, index) => {
        const { type, data } = modal;

        switch (type) {
          case MODAL_TYPES.POST_CREATE:
            return <PostCreateModal key={index} />;
          case MODAL_TYPES.PASSWORD_CHANGE:
            return <PasswordChangeModal key={index} />;
          case MODAL_TYPES.POST_UPDATE:
            return <PostUpdateModal key={index} post={data.post} />;
          case MODAL_TYPES.POST_DELETE:
            return <PostDeleteModal key={index} postId={data.postId} />;
          case MODAL_TYPES.POST_DETAIL:
            return <PostDetailModal key={index} postId={data.postId} />;
          case MODAL_TYPES.COMMENT_DELETE:
            return (
              <CommentDeleteModal
                key={index}
                postId={data.postId}
                commentId={data.commentId}
                deleteComment={data.deleteComment}
              />
            );
          case MODAL_TYPES.COMMENT_REPLY_DELETE:
            return (
              <CommentReplyDeleteModal
                key={index}
                postId={data.postId}
                parentId={data.parentId}
                replyId={data.replyId}
                deleteCommentReply={data.deleteCommentReply}
                updateCommentRepliesCount={data.updateCommentRepliesCount}
              />
            );
          case MODAL_TYPES.UNFOLLOW_USER:
            return <UnfollowModal key={index} targetUserId={data.targetUserId} />;
          default:
            return null;
        }
      })}
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
