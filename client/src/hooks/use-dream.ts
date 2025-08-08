import { useQuery } from "@tanstack/react-query";
import type { Dream } from "@shared/schema";

export function useDream(dreamId: string) {
  return useQuery<Dream>({
    queryKey: ['/api/dream', dreamId],
    enabled: !!dreamId,
  });
}

export function useDreams() {
  return useQuery<Dream[]>({
    queryKey: ['/api/dreams/static'],
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}