"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useAuthStore, User } from "@/lib/auth-store"

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  register: (username: string, email: string, password: string) => Promise<boolean>
  guestLogin: (username: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const {
    user,
    login: storeLogin,
    register: storeRegister,
    guestLogin: storeGuestLogin,
    logout: storeLogout,
    isLoading
  } = useAuthStore()

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      await storeLogin(username, password)
      return useAuthStore.getState().isAuthenticated
    } catch (error) {
      return false
    }
  }

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      await storeRegister(username, email, password)
      return useAuthStore.getState().isAuthenticated
    } catch (error) {
      return false
    }
  }

  const guestLogin = async (username: string): Promise<boolean> => {
    try {
      await storeGuestLogin(username)
      return useAuthStore.getState().isAuthenticated
    } catch (error) {
      return false
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      guestLogin,
      logout: storeLogout,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
