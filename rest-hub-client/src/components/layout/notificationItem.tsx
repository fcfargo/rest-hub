'use client';

import classNames from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import NotificationDropdownMenu from '../ui/dropdownMenu/NotificationDropdownMenu';

import {
  MODAL_TYPES,
  NOTIFICATION_MENU_ITEM_TYPES,
  NOTIFICATION_TYPES,
  PROFILE_IMAGE_DEFAULT,
  ROUTES,
} from '@/constants';
import { useAuth } from '@/context/authContext';
import { useModal } from '@/context/modalContext';
import { API_ENDPOINTS } from '@/libs/api';
import api from '@/libs/axiosInstance';
import styles from '@/styles/layout/notificationItem.module.css';
import { Notification } from '@/types';
import { apiRequest } from '@/utils/apiRequest';
import { formatTimeAgo } from '@/utils/format';

interface NotificationItemProps {
  notification: Notification;
  onDelete: (id: number) => void;
}

export default function NotificationItem({ notification, onDelete }: NotificationItemProps) {
  const { id, type, actor, message, isRead, createdAt, postId } = notification;

  const { openModal } = useModal();
  const router = useRouter();
  const { logout } = useAuth();

  const [isCurrentRead, setIsRead] = useState(isRead);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const markNotificationAsRead = async () => {
    if (isCurrentRead) return;

    await apiRequest(async (accessToken: string) => {
      return api.patch(
        `${API_ENDPOINTS.NOTIFICATION}/${id}/read`,
        { isRead: true },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
    }, logout);

    setIsRead(true);
  };

  const navigateToTarget = () => {
    if (type === NOTIFICATION_TYPES.FOLLOW && actor?.id) {
      router.push(`${ROUTES.USERS}/${actor.id}`);
      return;
    }

    if (type === NOTIFICATION_TYPES.LIKE && postId) {
      openModal(MODAL_TYPES.POST_DETAIL, { postId });
      return;
    }
  };

  /** 알림 내용 클릭 핸들러 */
  const handleClick = async () => {
    try {
      await markNotificationAsRead();
      navigateToTarget();
    } catch (err) {
      console.error('Failed to handle notification click:', err);
    }
  };

  /** 알림 삭제 */
  const deleteNotification = async () => {
    try {
      await apiRequest(async (accessToken: string) => {
        return api.delete(`${API_ENDPOINTS.NOTIFICATION}/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      }, logout);

      onDelete(id);
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  /** 드롭다운 메뉴 클릭 처리 */
  const handleNotificationMenuItem = async (value: number) => {
    switch (value) {
      case NOTIFICATION_MENU_ITEM_TYPES.DELETE:
        await deleteNotification();
        break;
      default:
        break;
    }
    setIsDropdownOpen(false);
  };

  return (
    <div className={classNames(styles.item, { [styles.unread]: !isCurrentRead })}>
      {/* 유저 프로필 */}
      <div className={styles.profileImageWrapper}>
        <Image
          src={actor?.profileImage || PROFILE_IMAGE_DEFAULT}
          alt={actor?.username || 'User'}
          width={36}
          height={36}
          className={styles.profileImage}
        />
      </div>

      {/* 본문 메시지 */}
      <div className={styles.content} onClick={handleClick} role="button" tabIndex={0}>
        <p className={styles.message}>
          <span className={styles.username}>{`${actor?.username}님이`}</span> {message}
        </p>

        <p className={styles.timestamp}>{formatTimeAgo(createdAt)}</p>
      </div>
      <div onClick={(e) => e.stopPropagation()} className={styles.actionButton}>
        <NotificationDropdownMenu
          open={isDropdownOpen}
          setOpen={setIsDropdownOpen}
          onSelectMenuItem={handleNotificationMenuItem}
        />
      </div>
    </div>
  );
}
