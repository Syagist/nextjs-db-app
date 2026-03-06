import { createAsyncThunk } from '@reduxjs/toolkit'
import { setCookie } from 'cookies-next'
import { COOKIES } from '@/types/enums'
import { authService } from './services'
import type { LoginCredentials, RegisterCredentials } from './types'

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    const res = await authService.login(credentials)
    const data = await res.json()

    if (!res.ok) {
      return rejectWithValue(data.error ?? 'Login failed')
    }

    setCookie(COOKIES.accessToken, data.accessToken)

    return data.accessToken as string
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    const res = await authService.register(credentials)
    const data = await res.json()

    if (!res.ok) {
      return rejectWithValue(data.error ?? 'Registration failed')
    }

    return data.message as string
  }
)

export const authThunks = { login, register }
