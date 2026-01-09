import axios from 'axios'

export const seatApi = axios.create({
  baseURL: 'https://aiot.fzu.edu.cn/api/ibs',
})

export const tokenApi = axios.create({
  baseURL: 'https://gettoken.learning.seeridia.top',
})
