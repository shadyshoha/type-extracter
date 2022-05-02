export interface Admin {
  name?: string
  email?: string
  password?: string
  active?: boolean
  tokens?: Array<string>;
  lastConnexion?: Date
  toDelete?: boolean
  _id?: string
  createdAt?: Date
}

export interface Signup {
  data: {
    email: string
    password: string
  }
}

export interface GetMe {
  token?: string
}

export interface GetConfirmationEmail {
  data: {
    email: string
  }
}

export interface IsEmailInUse {
  param: {
    email: string
  }
}

export interface Signin {
  data: {
    email: string
    password: string
  }
}

export interface RefreshToken {
  data: {
    refreshToken: string
  }
}

export interface Logout {
  token?: string
  param: {
    all?: boolean
    refreshToken: string
  }
}

export interface ChangePassword {
  token?: string
  data: {
    oldPassword: string
    newPassword: string
  }
}

export interface GetAccessTokenWithCode {
  param: {
    email: string
    code: number
  }
}

export interface ChangeForgottenPassword {
  param: {
    code: number
  }
  data: {
    email: string
    newPassword: string
  }
}

export interface DeleteMe {
  token?: string
  param: {
    password: string
  }
}

