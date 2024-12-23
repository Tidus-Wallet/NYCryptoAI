import axios from 'axios'

export const yunaAPIClient = axios.create({
  baseURL: 'https://api.yunaapi.com/v1',
  headers: {
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_YUNA_API_KEY}`,
  },
})
