export interface GetUsersConfig {
  lastUserId: string | null
  take: number
}

export interface IUser {
  name: string
  id: string
  image: string | File
  description?: string
  lastActivity: number
}

export interface IPost {
  id: string
  createdAt: number
  createdBy: 'angular' | 'react'
  title: string
  content: string
  author: string
  description: string
  lastEditAt: number
}
