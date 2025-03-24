"use client"

import { useState, useEffect } from "react"
import { useGetSchedulesQuery, useGetSchedulesByDateRangeQuery } from "../state/api"
import { useAppSelector } from "../state/redux"

interface UseSchedulesOptions {
  startDate?: Date
  endDate?: Date
  status?: string
  type?: string
  limit?: number
  offset?: number
}

export function useSchedules(options: UseSchedulesOptions = {}) {
  const { userInfo } = useAppSelector((state) => state.auth)
  const agencyId = userInfo?.agencyId

  const [queryParams, setQueryParams] = useState({
    agencyId,
    startDate: options.startDate?.toISOString(),
    endDate: options.endDate?.toISOString(),
    status: options.status,
    type: options.type,
    limit: options.limit || 100,
    offset: options.offset || 0,
  })

  // Use the appropriate query based on whether date range is provided
  const hasDateRange = Boolean(options.startDate && options.endDate)

  const schedulesQuery = useGetSchedulesQuery(
    {
      agencyId,
      status: options.status,
      type: options.type,
      limit: options.limit,
      offset: options.offset,
    },
    { skip: hasDateRange || !agencyId },
  )

  const dateRangeQuery = useGetSchedulesByDateRangeQuery(queryParams, { skip: !hasDateRange || !agencyId })

  // Determine which query to use based on whether date range is provided
  const query = hasDateRange ? dateRangeQuery : schedulesQuery

  // Update query params when options change
  useEffect(() => {
    setQueryParams({
      agencyId,
      startDate: options.startDate?.toISOString(),
      endDate: options.endDate?.toISOString(),
      status: options.status,
      type: options.type,
      limit: options.limit || 100,
      offset: options.offset || 0,
    })
  }, [options, agencyId])

  return {
    schedules: query.data?.data || [],
    meta: query.data?.meta,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}

