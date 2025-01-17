const getters = {
    sidebar: state => state.app.sidebar,
    device: state => state.app.device,
    roles: state => state.user.roles,
    permission_routes: state => state.permission.routes,
    token: state => state => state.user.token
}

export default getters