export interface GetUsersConfig {
  lastUserId: string | null
  take: number
}

export interface IUser {
  name: string
  id: string
  image: string
  description?: string
  lastActivity: number
}

export type IUserUpdateProps = Partial<
  | IUser
  | {
      image: File
    }
>

export interface IPost {
  id: string
  createdAt: number
  createdBy: 'angular' | 'react'
  title: string
  content: string
  author: string | IUser
  description: string
  lastEditAt: number
}
