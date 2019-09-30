export interface GetUsersConfig {
  skip: number
  take: number
  userId?: string
}

export interface FSUser {
  name: string
  id: string
  image: string
}

export interface FBUser {
  image: string
  name: string
  provider: string
  id: string
}
