import axios from 'axios'
const baseUrl = '/api/notes'


let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

function sendSearchQuery(query) {
  if (!query || query.trim() === "") {
    return null;
  }
  query = query.trim().toLowerCase()
  const request = axios.get(`${baseUrl}/search:${query}`)
  return request.then(res => res.data)
}

const create = async newObject => {

  let config = {
    headers: { Authorization: token }
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

const makeReaction = async (id, reaction) => {
  let config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(`${baseUrl}/${id}/${reaction}`, {}, config)
  return response.data
}

export default { getAll, create, update, setToken, sendSearchQuery, makeReaction }