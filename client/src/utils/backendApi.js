const { default:  axios } = require('axios');

export const backendUrl = "http://localhost:5555";

const authRoute = `${backendUrl}/auth`;

const authActions = {
  async signin(email, password){
    const response = await axios.post(`${authRoute}/signin`, { email, password })
    return response.data;
  },
  async signinToken(token) {
    const response = await axios.post(`${authRoute}/user-token`, { token })
    return response.data;
  },
  async signup(postData) {
    const response = await axios.post(`${authRoute}/signup`, postData)
    return response.data;
  }
}

const userFunctions = {
  async updateUserProfile(postData, token) {
    const response = await axios.post(`${backendUrl}/user/update-profile`, postData, { headers: {  'x-access-token': token } })
    return response.data;
  },
  async updateUserBankInfo(postData, token) {
    const response = await axios.post(`${backendUrl}/user/update-bankInfo`, postData, { headers: {  'x-access-token': token } })
    return response.data;
  },
  async updateUserSecurityInfo(postData, token) {
    const response = await axios.post(`${backendUrl}/user/change-password`, postData, { headers: {  'x-access-token': token } })
    return response.data;
  }
}

const adminFunctions = {
  async createService(postData, token) {
    const response = await axios.post(`${backendUrl}/admin/service/create`, postData, { headers: {  'x-access-token': token } })
    return response.data;
  },
  async updateService(postData, token) {
    const response = await axios.post(`${backendUrl}/admin/service/update`, postData, { headers: {  'x-access-token': token } })
    return response.data;
  },
  async deleteService(itemId, token) {
    const response = await axios.post(`${backendUrl}/admin/service/delete`, itemId, { headers: {  'x-access-token': token } })
    return response.data;
  },
}

const backendApi = {
  // auth routes
  ...authActions,
  ...userFunctions,
  ...adminFunctions,
  async getServices() {
    const response = await axios.get(`${backendUrl}/services`)
    return response.data;
  },
  async getChatrooms(token) {
    const response = await axios.get(`${backendUrl}/chatrooms`, { headers: { 'x-access-token': token } })
    return response.data;
  }
}

export default backendApi;