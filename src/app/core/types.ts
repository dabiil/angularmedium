export interface GetUsersConfig {
  lastUserId: string | null
  take: number
}

export interface FSUser {
  name: string
  id: string
  image: string
  description?: string
}

export interface UserUpdateData {
  image: File
  description: String
  name: string
}
