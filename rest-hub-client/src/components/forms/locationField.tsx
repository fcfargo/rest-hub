'use client';

import Image from 'next/image';
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';

import { CloseButtonBlack } from '../ui/closeButton';

import { INPUT_TYPES } from '@/constants';
import { usePlacesAutocomplete } from '@/hooks/usePlacesAutocomplete';
import styles from '@/styles/forms/locationField.module.css';
import { InfiniteScrollLoader } from '../ui/ScrollBoundaryIndicators';

interface LocationFieldProps {
  location: string;
  setLocation: Dispatch<SetStateAction<string>>;
}

export default function LocationField({ location, setLocation }: LocationFieldProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { suggestions, loading } = usePlacesAutocomplete(location);

  const suggestionsRef = useRef<HTMLUListElement>(null);

  /** 위치 입력 */
  const handleLocationInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
  }, []);

  /** 위치 선택 */
  const handleSelectLocation = useCallback((place: string) => {
    setLocation(place);
  }, []);

  /** 외부 클릭 감지하여 이모지 & 추천 리스트 닫기 */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.locationContainer}>
      <input
        className={styles.locationInput}
        type={INPUT_TYPES.TEXT}
        value={location}
        placeholder="Add location"
        onChange={handleLocationInput}
        onFocus={() => setShowSuggestions(true)}
      />

      <div className={styles.locationControl}>
        {location ? (
          <CloseButtonBlack
            className={styles.clearLocationButton}
            onClick={() => setLocation('')}
          />
        ) : (
          <Image
            className={styles.locationIcon}
            src="/post/location.svg"
            alt="Location Icon"
            width={16}
            height={18}
          />
        )}
      </div>

      {/* 자동완성된 주소 목록 표시 */}
      {location && showSuggestions && (
        <ul ref={suggestionsRef} className={styles.suggestionsList}>
          {loading ? (
            <InfiniteScrollLoader isLoading={loading} />
          ) : (
            suggestions.length > 0 &&
            suggestions.map((place) => (
              <li
                key={place.placeId}
                className={styles.suggestionItem}
                onClick={() => handleSelectLocation(place.description)}
              >
                {place.description}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
