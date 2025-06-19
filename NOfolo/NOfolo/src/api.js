import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://8e21fd965529948a.mokky.dev',
  withCredentials: true // для auth_me
})

export default instance