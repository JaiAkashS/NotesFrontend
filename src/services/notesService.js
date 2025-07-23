import axios from 'axios'
const baseUrl = '/api/notes'


let token = null

const setToken = token => {
  // eslint-disable-next-line no-unused-vars
  token = `Bearer ${token}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {

  let config = {
    headers:{ Authorization : token }
  }

  const response = await axios.post(baseUrl, newObject , config)
  return response.data
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

export default { getAll,create,update,setToken }