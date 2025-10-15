"use client"

import useSWR from "swr"
import { getBackendBaseUrl, swrFetcher } from "./api"
import type { JobDetailResponse, ListResponse } from "./types"

export function useList() {
  const url = `${getBackendBaseUrl()}/api/list`
  return useSWR<ListResponse>(url, swrFetcher)
}

export function useJob(jobId: string) {
  const url = `${getBackendBaseUrl()}/api/job/${jobId}`
  // Poll more frequently while pending/running
  const { data, error, isLoading, mutate } = useSWR<JobDetailResponse>(url, swrFetcher, {
    refreshInterval: (latest) => {
      const status = (latest as JobDetailResponse | undefined)?.status
      if (!status || status === "pending" || status === "running") return 1500
      return 0
    },
    dedupingInterval: 500,
    errorRetryCount: 5,
    errorRetryInterval: 1000,
    revalidateOnFocus: true,
    shouldRetryOnError: true,
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      // Never retry on 404
      if (error.status === 404) return
      
      // Only retry up to 5 times
      if (retryCount >= 5) return
      
      // Retry after 1 second
      setTimeout(() => revalidate({ retryCount }), 1000)
    }
  })
  return { data, error, isLoading, mutate }
}
