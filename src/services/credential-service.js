import axios from 'axios'

const { VUE_APP_API_URL } = process.env

const fetchCredentials = (token) => {
  return axios.get(`${VUE_APP_API_URL}/credential`,
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  )
}

const createCredential = (token, data) => {
  return axios.post(`${VUE_APP_API_URL}/credential`,
    data,
    {
      headers: { 'Authorization': `Bearer ${token}` },
    }
  )
}

const updateCredential = (token, data, id) => {
  return axios.patch(`${VUE_APP_API_URL}/credential/${id}`,
    data,
    {
      headers: { 'Authorization': `Bearer ${token}` },
    }
  )
}

const deleteCredential = (token, id) => {
  return axios.delete(`${VUE_APP_API_URL}/credential/${id}`,
    {
      headers: { 'Authorization': `Bearer ${token}` },
    }
  )
}

export {
  fetchCredentials,
  createCredential,
  updateCredential,
  deleteCredential
}