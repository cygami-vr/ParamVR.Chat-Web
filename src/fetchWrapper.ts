import env from '@/environment'

async function fetchWrapper(input: RequestInfo, init?: RequestInit) {

    return new Promise<Response>((resolve, reject) => {
  
        if (!env.isProduction) {
    
            if (!init) {
                init = {}
            }
            init.credentials = 'include'
            input = `http://localhost:${env.developmentPort}${input}`
        }
      
        fetch(input, init).then(resp => {
            if (resp.ok) {
                resolve(resp)
            } else {
                resp.text().then(text => {
                    reject(new Error(`${text}`))
                }).catch(err => {
                    reject(new Error(`${resp.status} ${resp.statusText}`))
                })
            }
        }).catch(err => {
            reject(err)
        })
    })
}
  
export default fetchWrapper