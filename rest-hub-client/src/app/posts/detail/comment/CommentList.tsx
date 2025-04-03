'use client';

import CommentItem from './CommentItem';

import styles from '@/styles/comment/commentList.module.css';
import { Comment } from '@/types';

interface CommentListProps {
  comments: Comment[];
}

export default function CommentList({ comments }: CommentListProps) {
  return (
    <div className={styles.container}>
      {comments.length === 0 ? (
        <div className={styles.empty}>아직 댓글이 없습니다.</div>
      ) : (
        comments.map((comment) => <CommentItem key={comment.id} comment={comment} />)
      )}
    </div>
  );
}
