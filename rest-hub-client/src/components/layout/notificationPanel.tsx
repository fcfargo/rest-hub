import classNames from 'classnames';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import NotificationItem from './notificationItem';
import { ErrorMessage } from '../ui/message';
import { InfiniteScrollLoader } from '../ui/ScrollBoundaryIndicators';

import { SCROLLTO_BEHAVIOR } from '@/constants';
import { useAuth } from '@/context/authContext';
import { useIsTabletOrMobile } from '@/hooks/useIsDesktop';
import { useMounted } from '@/hooks/useMounted';
import { API_ENDPOINTS } from '@/libs/api';
import api from '@/libs/axiosInstance';
import styles from '@/styles/layout/notificationPanel.module.css';
import { Notification } from '@/types';
import { apiRequest } from '@/utils/apiRequest';
import { mergeUniqueById } from '@/utils/array';

interface NotificationPanelProps {
  isNotificationOpen: boolean;
  onClose: () => void;
}

export default function NotificationPanel({ isNotificationOpen, onClose }: NotificationPanelProps) {
  const isMounted = useMounted();
  const { logout } = useAuth();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [latestTotalPages, setLatestTotalPages] = useState<number | null>(null);
  const [errorMessage, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const observerRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const scrollPositionRef = useRef(0);
  const isFetchingRef = useRef(false);
  const isMobileOrTablet = useIsTabletOrMobile();

  const onDelete = (id: number) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  /** 현재 스크롤 위치 저장 */
  const saveScrollPosition = () => {
    if (scrollContainerRef.current) {
      scrollPositionRef.current = scrollContainerRef.current.scrollTop;
    }
  };

  /**
   * 저장된 스크롤 위치로 복원
   * DOM 렌더링이 완료된 다음 프레임에 scrollTo를 실행하여
   * 스크롤 초기화 현상을 방지
   * */
  const restoreScrollPosition = () => {
    requestAnimationFrame(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({
          top: scrollPositionRef.current,
          behavior: SCROLLTO_BEHAVIOR.INSTANT,
        });
      }

      // 다음 fetchNotifications 실행을 허용
      isFetchingRef.current = false;
    });
  };

  // ✅ 알림 리스트 불러오기
  const fetchNotifications = async (page: number) => {
    if (isLoading || isFetchingRef.current) {
      return;
    }

    saveScrollPosition();
    setIsLoading(true);
    isFetchingRef.current = true;

    try {
      const { data } = await apiRequest(
        async (accessToken: string) =>
          api.get(API_ENDPOINTS.NOTIFICATION, {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: { page, limit: 20 },
          }),
        logout,
      );

      setNotifications((prev) => mergeUniqueById<Notification>(prev, data.body.notifications));

      setLatestTotalPages(data.body.meta.totalPages);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      setMessage('알림을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
      restoreScrollPosition();
    }
  };

  /** 알림 가져오기  */
  useEffect(() => {
    // 중복 요청 방지: fetchNotifications가 이미 실행 중인 경우
    if (isFetchingRef.current) {
      return;
    }
    fetchNotifications(currentPage);
  }, [currentPage]);

  /** 스크롤링 시 페이지의 마지막 게시물 감지 (Intersection Observer 등록) */
  useEffect(() => {
    if (!observerRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          latestTotalPages !== null &&
          currentPage < latestTotalPages &&
          !isFetchingRef.current
        ) {
          setCurrentPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [currentPage, latestTotalPages]);

  useEffect(() => {
    if (!isMounted) {
      setNotifications([]);
      setCurrentPage(1);
      setLatestTotalPages(null);
    }
  }, [isMounted]);

  return (
    <aside
      className={classNames(
        styles.notificationPanel,
        isMounted && styles.active,
        isMounted && isNotificationOpen ? styles.open : styles.closed,
      )}
    >
      <div className={styles.header}>
        <h2>알림</h2>
        <button className={styles.closeButton} onClick={onClose}>
          <Image
            className={styles.closeIcon}
            src="/settings/cancel-black.svg"
            alt="Close"
            width={18}
            height={18}
          />
        </button>
      </div>
      <div ref={scrollContainerRef} className={styles.content}>
        {errorMessage && <ErrorMessage message={errorMessage} />}

        {notifications.length === 0 && !isLoading && !errorMessage && (
          <div className={styles.empty}>알림이 없습니다.</div>
        )}

        <div className={styles.itemContainer}>
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onDelete={onDelete}
              onClose={isMobileOrTablet ? onClose : undefined}
            />
          ))}
        </div>

        <InfiniteScrollLoader isLoading={isLoading} observerRef={observerRef} />
      </div>
    </aside>
  );
}
