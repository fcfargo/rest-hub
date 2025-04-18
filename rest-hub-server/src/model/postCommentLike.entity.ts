import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Column,
  Unique,
  Index,
} from 'typeorm';

import { PostComment } from './postComment.entity';
import { User } from './user.entity';

@Index(['userId'])
@Index(['commentId'])
@Entity({ name: 'post_comment_likes' })
@Unique(['userId', 'commentId'])
export class PostCommentLike {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: number;

  @Column()
  commentId: string;

  @ManyToOne(() => User, (user) => user.commentLikes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => PostComment, (comment) => comment.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'commentId' })
  comment: PostComment;

  @CreateDateColumn()
  createdAt: Date;
}
