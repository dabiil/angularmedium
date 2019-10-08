export interface GetUsersConfig {
  lastUserId: string | null
  take: number
}

export interface IUser {
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

export interface IPost {
  id: string
  createdAt: string
  createdBy: 'angular' | 'react'
  title: string
  content: string
  author: string
  description: string
}
