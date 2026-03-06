export type LoginCredentials = {
  email: string
  password: string
}

export type RegisterCredentials = {
  email: string
  password: string
  name?: string
}

export type LoginResponse = {
  accessToken: string
}

export type AuthState = {
  accessToken: string | null
  loading: boolean
  error: string | null
}
