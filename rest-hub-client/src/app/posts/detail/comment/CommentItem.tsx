import styles from '@/styles/comment/commentItem.module.css';
import { Comment } from '@/types';

interface CommentItemProps {
  comment: Comment;
}

export default function CommentItem({ comment }: CommentItemProps) {
  return (
    <div className={styles.item}>
      <div className={styles.author}>{comment.user.username}</div>
      <div className={styles.content}>{comment.content}</div>
    </div>
  );
}
