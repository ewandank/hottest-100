import { browser } from "$app/environment"
export const fetchRefresh = async (fetch, path) => {
    const request = fetch(path)
  
    // if request is made on server, return request,
    // as it will refresh the token on the server
    if (!browser) return request
  
    const response = await request
  
    // if the response is 401, refresh the token and try again
    // else return the response
    if (response.status === 401) {
      /* all this is to prevent multiple refresh requests at the same time */
      // if there is already a refresh request, wait for it to finish
      if (!window.refreshPromise) {
        // if there is no refresh request, create one
        window.refreshPromise = fetch("/api/auth/refresh")
          // when the refresh request is done, set the refresh promise to undefined in the window object
          .finally(() => {
            window.refreshPromise = undefined
          })
      }
  
      const refreshRes = await window.refreshPromise
  
      // if the refresh request fails, throw an error
      if (!refreshRes.ok) {
        throw error(401, "Session Expired!")
      }
  
      return fetch(path)
    } else {
      return response
    }
  }
  