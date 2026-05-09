"use client"

import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import type { MockUser } from "@/types/api"

type ActingUserState = {
  actingUser: MockUser | null
  actingUserId: string | null
  hasHydrated: boolean
  setActingUser: (user: MockUser) => void
  clearActingUser: () => void
  setHasHydrated: (hasHydrated: boolean) => void
}

export const useActingUserStore = create<ActingUserState>()(
  persist(
    (set) => ({
      actingUser: null,
      actingUserId: null,
      hasHydrated: false,
      setActingUser: (actingUser) =>
        set({
          actingUser,
          actingUserId: actingUser.id,
        }),
      clearActingUser: () =>
        set({
          actingUser: null,
          actingUserId: null,
        }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: "vacation-management-acting-user",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
      partialize: (state) => ({
        actingUser: state.actingUser,
        actingUserId: state.actingUserId,
      }),
    }
  )
)
