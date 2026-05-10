import { useState } from "react"

export function usePagination(defaultSize = 5) {
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(defaultSize)
  const resetPage = () => setPage(0)
  return { page, size, setPage, setSize, resetPage }
}
