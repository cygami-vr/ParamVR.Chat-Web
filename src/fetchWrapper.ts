const isDev = window.origin.indexOf('localhost') === 7 || window.origin.indexOf('127.0.0.1') === 7

async function fetchWrapper(input: RequestInfo, init?: RequestInit) {
  
    if (isDev) {
        // dev env

        if (!init) {
            init = {}
        }
        init.credentials = 'include'
    
        const module = await import('./portConfig.js')
        input = `http://localhost:${module.default.devServer}${input}`
        return await fetch(input, init)
    }
  
    return await fetch(input, init)
}
  
  export default fetchWrapper