import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';

import { User } from './user.entity';

import {
  NOTIFICATION_TYPES,
  NotificationType,
} from '@/notifications/interfaces/notification.interface';

@Index(['id'])
@Index(['userId'])
@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.receivedNotifications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'enum', enum: NOTIFICATION_TYPES })
  type: NotificationType;

  @Column({ nullable: true })
  actorId?: number; // 알림 발생시킨 주체 (ex: 좋아요 누른 유저 id)

  @ManyToOne(() => User, (user) => user.sentNotifications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'actorId' })
  actor: User;

  @Column({ nullable: true })
  postId?: string; // 관련된 게시글 id 등 context 정보

  @Column({ type: 'text', nullable: true })
  message?: string;

  @Column({ default: false })
  isRead?: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  readAt?: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
