'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { v4 as uuidv4 } from "uuid" // Add this import to generate random UUIDs
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  browserLocalPersistence,
  setPersistence,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth"
import { auth } from "@/lib/firebaseConfig"
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore"

const db = getFirestore()

const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
})

const registerSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters" }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" }),
  email: z
    .string()
    .email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
})

interface AuthFormProps {
  mode: 'login' | 'register'
}

export function AuthForm({ mode }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
  const [usernameSuggestion, setUsernameSuggestion] = useState<string | null>(null)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isValid },
  } = useForm<{
    email: string
    password: string
    fullName?: string
    username?: string
  }>({
    resolver: zodResolver(mode === 'login' ? loginSchema : registerSchema),
    mode: "onChange",
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        router.push('/dashboard') // Redirect to dashboard if authenticated and verified
      }
    })
    return () => unsubscribe()
  }, [router])

  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0) {
      router.push('/login') // Redirect to the login page
    }
  }, [countdown, router])

  // Save user data to Firestore
  const saveUserToFirestore = async (
    email: string,
    fullName: string,
    username: string,
  ) => {
    const userUid = uuidv4(); // Generate a unique UID for the user
    const docUid = uuidv4(); // Generate a unique UID for the document
  
    const userDocRef = doc(collection(db, "users"), docUid);
    await setDoc(userDocRef, {
      uid: userUid,
      name: fullName,
      email: email,
      username: username,
      location: "",
      gender: "",
      preferences: {
        music: [],
        sports: [],
        travel: [],
        culture: [],
        community_involvement: [],
        entertainment: [],
      },
      xpPoints: 0,
      donationPoints: 0,
      level: 0,
      friends: [],
      joinedEvents: [],
      createdEvents: [],
      tickets: {},
    });
  };

  // Generate unique username
  const generateUniqueUsername = async (baseUsername: string) => {
    const usersRef = collection(db, "users")
    const q = query(
      usersRef,
      where("username", ">=", baseUsername),
      where("username", "<=", baseUsername + "\uf8ff")
    )
    const snapshot = await getDocs(q)
    const count = snapshot.docs.length
    return count === 0 ? baseUsername : `${baseUsername}${count}`
  }

  // Handle username availability check
  const handleUsernameBlur = async (
    event: React.FocusEvent<HTMLInputElement>
  ) => {
    const username = event.target.value.trim()
    if (username.length < 3) {
      // Username too short, no need to check
      return
    }
    try {
      const usersRef = collection(db, "users")
      const q = query(usersRef, where("username", "==", username))
      const snapshot = await getDocs(q)
      if (!snapshot.empty) {
        // Username exists
        const suggestedUsername = await generateUniqueUsername(username)
        setUsernameAvailable(false)
        setUsernameSuggestion(suggestedUsername)
        setError("username", {
          type: "manual",
          message: `Username already exists. Suggestion: ${suggestedUsername}`,
        })
      } else {
        // Username is available
        setUsernameAvailable(true)
        setUsernameSuggestion(null)
        clearErrors("username")
      }
    } catch (error) {
      console.error("Error checking username availability:", error)
    }
  }

  // Handle email-based authentication
  const handleEmailAuth = async (
    mode: string,
    data: { email: string; password: string; fullName?: string; username?: string }
  ) => {
    try {
      setAuthError(null)
      setIsLoading(true)

      // Set persistence for session continuity
      await setPersistence(auth, browserLocalPersistence)

      if (mode === 'login') {
        const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password)
        const user = userCredential.user

        // Check user's level in Firestore
        const usersRef = collection(db, "users")
        const q = query(usersRef, where("email", "==", data.email))
        const querySnapshot = await getDocs(q)

        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data()
          const userLevel = userData.level || 0

          if (userLevel >= 2) {
            router.push('/dashboard') // Redirect to dashboard
          } else {
            router.push('/not-found') // Redirect to not-found
          }
        } else {
          setAuthError("User data not found. Please contact support.")
        }
      } else {
        const { email, password, fullName, username } = data
        await createUserWithEmailAndPassword(auth, email, password)

        const userUid = uuidv4()
        const docUid = uuidv4()
        const userDocRef = doc(collection(db, "users"), docUid)

        await setDoc(userDocRef, {
          uid: userUid,
          name: fullName,
          email,
          username,
          level: 0,
        })

        router.push('/dashboard') // Redirect to dashboard after registration
      }
    } catch (error: unknown) {
      const firebaseError = error as { code: string }
      setAuthError(
        firebaseError.code === "auth/user-not-found" || firebaseError.code === "auth/wrong-password"
          ? "Incorrect email or password. Please try again."
          : firebaseError.code === "auth/email-already-in-use"
          ? "This email is already registered. Please log in."
          : "An unexpected error occurred. Please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Google sign-in
  async function handleGoogleAuth() {
    try {
      setAuthError(null)
      setIsLoading(true)
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      const fullName = user.displayName || "Unnamed User"
      const email = user.email!
      const usernameBase = fullName.replace(/\s+/g, "").toLowerCase()
      const uniqueUsername = await generateUniqueUsername(usernameBase)
      await saveUserToFirestore(email, fullName, uniqueUsername)
      router.push('/dashboard') // Redirect after Google Sign-In
    } catch (error: unknown) {
      const firebaseError = error as { code: string }
      setAuthError(
        firebaseError.code === "auth/popup-closed-by-user"
          ? "Google sign-in was canceled. Please try again."
          : firebaseError.code === "auth/account-exists-with-different-credential"
          ? "An account already exists with this email. Please use another method."
          : "An unexpected error occurred during Google sign-in. Please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (
    data: {
      email: string
      password: string
      fullName?: string
      username?: string
    }
  ) => {
    setIsLoading(true)
    if (mode === 'register') {
      // Final check for username availability
      const username = data.username?.trim()
      if (username && username.length >= 3) {
        const usersRef = collection(db, "users")
        const q = query(usersRef, where("username", "==", username))
        const snapshot = await getDocs(q)
        if (!snapshot.empty) {
          // Username exists
          const suggestedUsername = await generateUniqueUsername(username)
          setUsernameAvailable(false)
          setUsernameSuggestion(suggestedUsername)
          setError("username", {
            type: "manual",
            message: `Username already exists. Suggestion: ${suggestedUsername}`,
          })
          setIsLoading(false)
          return
        } else {
          setUsernameAvailable(true)
          setUsernameSuggestion(null)
          clearErrors("username")
        }
      }
    }
    await handleEmailAuth(mode, data)
  }

  const handleForgotPassword = async () => {
    try {
      const email = (document.getElementById('email') as HTMLInputElement).value
      if (!email) {
        setAuthError("Please enter your email address.")
        return
      }
      await sendPasswordResetEmail(auth, email)
      setSuccessMessage("Password reset email sent. Please check your inbox.")
    } catch {
      setAuthError("Failed to send password reset email. Please try again.")
    }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={mode}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">
            {mode === 'login' ? 'Welcome back!' : 'Create an account'}
          </h1>
          <p className="text-gray-500">
            {mode === 'login'
              ? 'Enter your email below to login to your account'
              : 'Enter your information below to create your account'}
          </p>
        </div>

        {authError && (
          <div className="text-red-500 text-sm text-center">
            {authError}
          </div>
        )}

        {successMessage && (
          <div className="text-green-500 text-sm text-center">
            {successMessage}
            {countdown !== null && countdown > 0 && (
              <p>This page will reload in {countdown}s</p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {mode === 'register' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  {...register("fullName")}
                />
                {errors.fullName && (
                  <p className="text-sm text-red-500">{errors.fullName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                {usernameAvailable === false && usernameSuggestion && (
                  <p className="text-sm text-red-500">
                  </p>
                )}
                <Input
                  id="username"
                  placeholder="johndoe"
                  {...register("username")}
                  onBlur={handleUsernameBlur}
                />
                {errors.username && (
                  <p className="text-sm text-red-500">{errors.username.message}</p>
                )}
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {mode === 'login' && (
                <Button
                  type="button"
                  variant="link"
                  className="px-0 font-normal"
                  onClick={handleForgotPassword}
                >
                  Forgot password?
                </Button>
              )}
            </div>
            <Input
              id="password"
              type="password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!isValid || isLoading}
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {mode === 'login' ? 'Sign In' : 'Sign Up'}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">Or continue with</span>
          </div>
        </div>

        <Button variant="outline" className="w-full" onClick={handleGoogleAuth}>
          <Icons.google className="mr-2 h-4 w-4" />
          {mode === 'login' ? 'Sign in with Google' : 'Sign up with Google'}
        </Button>

        <p className="text-center text-sm text-gray-500">
          {mode === 'login'
            ? "Don't have an account? "
            : "Already have an account? "}
          <Link
            href={mode === 'login' ? '/register' : '/login'}
            className="text-blue-600 hover:underline"
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </Link>
        </p>
      </motion.div>
    </AnimatePresence>
  )
}
