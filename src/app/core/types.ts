export interface GetUsersConfig {
  lastUserId: string | null
  take: number
}

export interface FSUser {
  name: string
  id: string
  image: string
}

export interface IUpdateCurrentUserProps extends Partial<FSUser> {}
