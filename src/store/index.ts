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
        setCredentials: (by) => { set({credentials: by}) },
        resetCredentials: () => { set({credentials: null}) }
      }),
      {
        name: "login-storage",
        storage: createJSONStorage(() => sessionStorage)
      }
    )
  )
)

export interface Signup {
  password: string
}

export interface SignupState {
  password: string|null
  setPassword: (password: string) => void
  username: string|null
  setUsername: (username: string) => void
  accept: boolean
  setAccept: (accept: boolean) => void
  vid: string|null
  setVid: (vid: string) => void
  reset: () => void
}

export const useSignup = create<SignupState>()(
  devtools(
    persist(
      (set) => ({
        password: null,
        setPassword: (password) => { set({password}) },
        username: null,
        setUsername: (username) => { set({username}) },
        accept: false,
        setAccept: (accept) => { set({accept}) },
        vid: null,
        setVid: (vid) => { set({vid}) },
        reset: () => { set({password: null, username: null, accept: false, vid: null}) }
      }),
      {
        name: "signup-storage",
        storage: createJSONStorage(() => sessionStorage)
      }
    )
  )
)


export interface PasswordResetState {
  email: string | null,
  setEmail: (email: string) => void,
  resetId: string | null,
  setResetId: (code: string) => void,
  newPassword: string | null,
  setNewPassword: (password: string) => void,
  reset: () => void
}

export const usePasswordReset = create<PasswordResetState>()(
  devtools(
    persist(
      (set) => ({
        email: null,
        setEmail: (email) => {
          set({email})
        },
        resetId: null,
        setResetId: (code) => {
          set({resetId: code})
        },
        newPassword: null,
        setNewPassword: (password) => {
          set({newPassword: password})
        },
        reset: () => {
          set({email: null, resetId: null, newPassword: null})
        }
      }),
      {
        name: "password-reset-storage",
        storage: createJSONStorage(() => sessionStorage)
      }
    )
  )
)
