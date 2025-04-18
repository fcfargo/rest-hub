import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
  Check,
} from 'typeorm';

import { PostCommentLike } from './postCommentLike.entity';

import { Post } from '@/model/post.entity';
import { User } from '@/model/user.entity';

@Index(['id'])
@Index(['userId'])
@Index(['postId'])
@Entity({ name: 'post_comments' })
export class PostComment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: number;

  @Column()
  postId: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ nullable: true })
  parentId?: string;

  @ManyToOne(() => PostComment, (comment) => comment.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parentId' })
  parent?: PostComment;

  @OneToMany(() => PostComment, (comment) => comment.parent)
  children: PostComment[];

  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post: Post;

  @Column({ default: 0 })
  @Check(`"likesCount" >= 0`)
  likesCount: number;

  @Column({ default: 0 })
  @Check(`"repliesCount" >= 0`)
  repliesCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => PostCommentLike, (like) => like.comment)
  likes: PostCommentLike[];
}
