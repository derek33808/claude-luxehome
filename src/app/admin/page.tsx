'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Check if already authenticated
  useEffect(() => {
    const storedPassword = sessionStorage.getItem('admin_token')
    if (storedPassword) {
      router.push('/admin/orders')
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Test authentication by making a request to the admin API
      const response = await fetch('/.netlify/functions/admin-orders?limit=1', {
        headers: {
          Authorization: `Bearer ${password}`,
        },
      })

      if (response.ok) {
        // Store password in session storage
        sessionStorage.setItem('admin_token', password)
        router.push('/admin/orders')
      } else {
        setError('Invalid password')
      }
    } catch {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">LuxeHome Admin</h1>
            <p className="text-gray-600 mt-2">Enter your admin password to continue</p>
          </div>

          <form onSubmit={handleLogin}>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Enter admin password"
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-3 px-4 rounded-md font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Authenticating...' : 'Login'}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-500 text-sm mt-4">
          <Link href="/" className="hover:text-gray-700">
            &larr; Back to store
          </Link>
        </p>
      </div>
    </div>
  )
}
