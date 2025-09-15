"use client"

import { useState, useEffect } from "react"

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true"
    const email = localStorage.getItem("userEmail") || ""

    setIsLoggedIn(loggedIn)
    setUserEmail(email)
    setIsLoading(false)
  }, [])

  const login = (email: string) => {
    localStorage.setItem("isLoggedIn", "true")
    localStorage.setItem("userEmail", email)
    setIsLoggedIn(true)
    setUserEmail(email)
  }

  const logout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("userEmail")
    setIsLoggedIn(false)
    setUserEmail("")
  }

  return {
    isLoggedIn,
    userEmail,
    isLoading,
    login,
    logout,
  }
}
