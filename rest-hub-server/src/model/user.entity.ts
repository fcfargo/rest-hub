import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  Index,
  Check,
} from 'typeorm';

import { Post } from './post.entity';
import { PostComment } from './postComment.entity';
import { PostCommentLike } from './postCommentLike.entity';
import { PostLike } from './postLike.entity';

import { SOCIAL_PROVIDERS, SocialProvider } from '@/users/interfaces/users.interface';

@Index(['id'])
@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  profileImage?: string;

  @Column({ nullable: true })
  deviceToken?: string;

  @Column({ nullable: true })
  description?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @Column({ type: 'enum', enum: SOCIAL_PROVIDERS, nullable: true })
  socialProvider?: SocialProvider;

  @OneToMany(() => Post, (post) => post.user, { cascade: true })
  posts: Post[];

  @OneToMany(() => PostLike, (like) => like.user)
  likes: PostLike[];

  @OneToMany(() => PostComment, (comment) => comment.user)
  comments: PostComment[];

  @OneToMany(() => PostCommentLike, (like) => like.user)
  commentLikes: PostCommentLike[];

  @Column({ default: 0 })
  @Check(`"followingsCount" >= 0`)
  followingsCount: number;

  @Column({ default: 0 })
  @Check(`"followersCount" >= 0`)
  followersCount: number;
}
