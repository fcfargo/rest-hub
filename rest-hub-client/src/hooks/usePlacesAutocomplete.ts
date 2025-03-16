import { useState, useEffect } from 'react';

import { useAuth } from '@/context/authContext';
import { API_ENDPOINTS } from '@/libs/api';
import api from '@/libs/axiosInstance';
import { apiRequest } from '@/utils/apiRequest';

export const usePlacesAutocomplete = (input: string) => {
  const [suggestions, setSuggestions] = useState<{ placeId: string; description: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    if (!input) {
      setSuggestions([]);
      return;
    }

    const fetchPlaces = async () => {
      setLoading(true);

      try {
        const { data } = await apiRequest(async (accessToken: string) => {
          return api.get(API_ENDPOINTS.PLACES_AUTOCOMPLETE, {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: {
              input,
            },
          });
        }, logout);

        setSuggestions(
          data.body.map((place: any) => ({
            placeId: place.placeId,
            description: place.description,
          })),
        );
      } catch (error) {
        console.error('Error fetching places:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(() => fetchPlaces(), 300); // 입력 지연 (Debounce)
    return () => clearTimeout(debounce);
  }, [input]);

  return { suggestions, loading };
};
