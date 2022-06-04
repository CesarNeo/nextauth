import axios, { AxiosError } from 'axios'
import { parseCookies, setCookie } from 'nookies'

interface AxiosErrorResponse {
  code?: string
}

let cookies = parseCookies()
let isRefresing = false
let failedRequestsQueue = [] as any

export const api = axios.create({
  baseURL: 'http://localhost:3333',
  headers: {
    Authorization: `Bearer ${cookies['nextauth.token']}`
  }
})

api.interceptors.response.use(
  response => {
    return response
  },
  async (error: AxiosError<AxiosErrorResponse>) => {
    if (error.response?.status === 401) {
      if (error.response.data.code === 'token.expired') {
        cookies = parseCookies()

        const { 'nextauth.refreshToken': refreshToken } = cookies
        const originalConfig = error.config

        if (!isRefresing) {
          isRefresing = true

          api
            .post('/refresh', {
              refreshToken
            })
            .then(response => {
              const { token } = response.data

              setCookie(undefined, 'nextauth.token', token, {
                maxAge: 60 * 60 * 24 * 30, // 30 days
                path: '/'
              })
              setCookie(
                undefined,
                'nextauth.refreshToken',
                response.data.refreshToken,
                {
                  maxAge: 60 * 60 * 24 * 30, // 30 days
                  path: '/'
                }
              )

              api.defaults.headers.common['Authorization'] = `Bearer ${token}`

              failedRequestsQueue.forEach((request: any) =>
                request.onSuccess(token)
              )
              failedRequestsQueue = []
            })
            .catch(err => {
              failedRequestsQueue.forEach((request: any) =>
                request.onFailure(err)
              )
              failedRequestsQueue = []
            })
            .finally(() => {
              isRefresing = false
            })
        }

        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({
            onSuccess: (token: string) => {
              if (!originalConfig?.headers) {
                return
              }

              originalConfig.headers['Authorization'] = `Bearer ${token}`

              resolve(api(originalConfig))
            },
            onFailure: (err: AxiosError) => {
              reject(err)
            }
          })
        })
      } else {
      }
    }
  }
)
