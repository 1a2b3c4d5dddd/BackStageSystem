import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter,constantRoutes,asyncRoutes,anyRoutes } from '@/router'
// import { resetRouter} from '@/router'
import router from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name:'',
    avatar:'',
    routes:[],
    buttons:[],
    roles:[],
    // 根据当前用户的 routes 与 所有的异步路由进行对比筛选的结果
    filterRoutes:[],  
    endAllRoutes:[],  // 上面筛选的结果与常量路由和任意路由合并 即为当前用户所能访问的完整路由
  }
}

// 筛选异步路由
const filterRoutesFn = (asyncRoutes,routes) => {
  return asyncRoutes.filter(item => {
    if (routes.indexOf(item.name) != -1) {
      if (item.children && item.children.length) {
        item.children = filterRoutesFn(item.children,routes)
      }
      return true
    }
  })
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // 存储用户的所有信息
  SET_USERINFO(state,value) {
    // 存储用户名
    state.name = value.name
    // 存储用户头像
    state.avatar = value.avatar
    // 存储按钮权限标记
    state.buttons = value.buttons
    // 存储菜单权限标记
    state.routes = value.routes
    // 存储当前用户的角色
    state.roles = value.roles
  },
  SET_FILTERROUTES(state,value) {
    state.filterRoutes = value
    state.endAllRoutes = constantRoutes.concat(state.filterRoutes,anyRoutes)
    router.addRoutes(state.endAllRoutes)
  }
}

const actions = {
  // 用户登入
  async login({ commit }, userInfo) {
    const { username, password } = userInfo
    let result = await login({ username: username.trim(), password: password })
    // 因为是 mock 数据，成功的 code 是20000
    if (result.code == 20000) {
      commit('SET_TOKEN', result.data.token)
      // 将 token 放在 cookie 里【跟之前存在本地存储类似】
      setToken(result.data.token)
      return 'ok'
    } else {
      return Promise.reject(new Error('faile'))
    }
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        commit('SET_USERINFO', data)
        commit('SET_FILTERROUTES',filterRoutesFn(asyncRoutes,data.routes))
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

