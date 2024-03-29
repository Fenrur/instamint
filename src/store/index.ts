import {create} from "zustand"
import {createJSONStorage, devtools, persist} from "zustand/middleware"

export interface Credentials {
  email: string,
  password: string
}

export interface LoginState {
  credentials: Credentials | null,
  setCredentials: (by: Credentials) => void,
  resetCredentials: () => void
}

export const useLogin = create<LoginState>()(
  devtools(
    persist(
      (set) => ({
        credentials: null,
        setCredentials: (by) => set({credentials: by}),
        resetCredentials: () => set({credentials: null})
      }),
      {
        name: "login-storage",
        storage: createJSONStorage(() => sessionStorage)
      }
    )
  )
)
