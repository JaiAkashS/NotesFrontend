import axios from 'axios'
const baseUrl = '/api/notes'
const usersBaseUrl = '/api/users'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = (page = 1, limit = 10) => {
  const config = token ? { headers: { Authorization: token } } : {}
  return axios.get(baseUrl, { ...config, params: { page, limit } }).then(response => response.data)
}

const getFollowingFeed = (page = 1) => {
  const config = { headers: { Authorization: token } }
  return axios.get(`${baseUrl}/following`, { ...config, params: { page } }).then(res => res.data)
}

const getDrafts = () => {
  const config = { headers: { Authorization: token } }
  return axios.get(`${baseUrl}/drafts`, config).then(res => res.data)
}

const getHistory = () => {
  const config = { headers: { Authorization: token } }
  return axios.get(`${baseUrl}/history`, config).then(res => res.data)
}

const getNote = (id) => {
  const config = token ? { headers: { Authorization: token } } : {}
  return axios.get(`${baseUrl}/${id}`, config).then(res => res.data)
}

const publishDraft = (id) => {
  const config = { headers: { Authorization: token } }
  return axios.put(`${baseUrl}/${id}`, { isDraft: false }, config).then(res => res.data)
}

const uploadImage = (file) => {
  const config = { headers: { Authorization: token, 'Content-Type': 'multipart/form-data' } }
  const formData = new FormData()
  formData.append('image', file)
  return axios.post('/api/upload', formData, config).then(res => res.data)
}

const getNotifications = () => {
  const config = { headers: { Authorization: token } }
  return axios.get('/api/notifications', config).then(res => res.data)
}

const getUnreadCount = () => {
  const config = { headers: { Authorization: token } }
  return axios.get('/api/notifications/unread-count', config).then(res => res.data)
}

const markAllRead = () => {
  const config = { headers: { Authorization: token } }
  return axios.put('/api/notifications/read-all', {}, config).then(res => res.data)
}

const deleteNote = async (id) => {
  const config = { headers: { Authorization: token } }
  await axios.delete(`${baseUrl}/${id}`, config)
}

const followUser = (username) => {
  const config = { headers: { Authorization: token } }
  return axios.post(`${usersBaseUrl}/${username}/follow`, {}, config).then(res => res.data)
}

const getTrending = () => {
  return axios.get(`${baseUrl}/trending`).then(res => res.data)
}

const search = (params) => {
  return axios.get(`${baseUrl}/search`, { params }).then(res => res.data)
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
  const config = { headers: { Authorization: token } }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

const makeReaction = async (id, reaction) => {
  const config = { headers: { Authorization: token } }
  const response = await axios.post(`${baseUrl}/${id}/${reaction}`, {}, config)
  return response.data
}

const saveNote = async (id) => {
  const config = { headers: { Authorization: token } }
  const response = await axios.post(`${baseUrl}/${id}/save`, {}, config)
  return response.data
}

const unsaveNote = async (id) => {
  const config = { headers: { Authorization: token } }
  const response = await axios.post(`${baseUrl}/${id}/unsave`, {}, config)
  return response.data
}

const getSavedNotes = async () => {
  const config = { headers: { Authorization: token } }
  const response = await axios.get(`${baseUrl}/saved`, config)
  return response.data
}

// Comments
const getComments = async (noteId) => {
  const response = await axios.get(`${baseUrl}/${noteId}/comments`)
  return response.data
}

const addComment = async (noteId, content, parentComment = null) => {
  const config = { headers: { Authorization: token } }
  const response = await axios.post(`${baseUrl}/${noteId}/comments`, { content, parentComment }, config)
  return response.data
}

const deleteComment = async (noteId, commentId) => {
  const config = { headers: { Authorization: token } }
  await axios.delete(`${baseUrl}/${noteId}/comments/${commentId}`, config)
}

// Author Profiles
const getProfile = async (username) => {
  const response = await axios.get(`${usersBaseUrl}/${username}`)
  return response.data
}

const updateProfile = async (username, profileData) => {
  const config = { headers: { Authorization: token } }
  const response = await axios.put(`${usersBaseUrl}/${username}`, profileData, config)
  return response.data
}

// Collections
const getCollections = async () => {
  const response = await axios.get('/api/collections')
  return response.data
}

const getCollectionsByUser = async (username) => {
  const response = await axios.get(`/api/collections/by/${username}`)
  return response.data
}

const getCollection = async (id) => {
  const response = await axios.get(`/api/collections/${id}`)
  return response.data
}

const createCollection = async (data) => {
  const config = { headers: { Authorization: token } }
  const response = await axios.post('/api/collections', data, config)
  return response.data
}

const updateCollection = async (id, data) => {
  const config = { headers: { Authorization: token } }
  const response = await axios.put(`/api/collections/${id}`, data, config)
  return response.data
}

const addPostToCollection = async (collectionId, postId) => {
  const config = { headers: { Authorization: token } }
  const response = await axios.post(`/api/collections/${collectionId}/posts`, { postId }, config)
  return response.data
}

const removePostFromCollection = async (collectionId, postId) => {
  const config = { headers: { Authorization: token } }
  await axios.delete(`/api/collections/${collectionId}/posts/${postId}`, config)
}

const deleteCollection = async (id) => {
  const config = { headers: { Authorization: token } }
  await axios.delete(`/api/collections/${id}`, config)
}

export default {
  getAll, getTrending, create, update, setToken, sendSearchQuery, search,
  makeReaction, saveNote, unsaveNote, getSavedNotes,
  getComments, addComment, deleteComment,
  getProfile, updateProfile,
  getCollections, getCollectionsByUser, getCollection,
  createCollection, updateCollection, deleteCollection,
  addPostToCollection, removePostFromCollection,
  getFollowingFeed, getDrafts, getHistory, getNote, publishDraft, uploadImage,
  getNotifications, getUnreadCount, markAllRead, followUser, deleteNote
}
