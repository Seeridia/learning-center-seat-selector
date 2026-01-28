/*
 * stores/tokenStore.ts
 * 统一 token 的读写
 */

const KEY = 'learning_center_token'

export const tokenStore = {
  get(): string | null {
    return localStorage.getItem(KEY)
  },

  set(token: string) {
    localStorage.setItem(KEY, token)
  },

  clear() {
    localStorage.removeItem(KEY)
  },
}
