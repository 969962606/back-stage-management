import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// Layout
import Layout from '@/layout'

export const constantRoutes = [{
        path: '/login',
        component: () =>
            import ('@/views/login/index'),
        hidden: true
    },
    {
        path: '/white',
        component: () =>
            import ('@/views/login/white'),
        hidden: true
    },
    {
        path: '/',
        component: Layout,
        redirect: '/index',
        name: 'Index',
        children: [{
            path: 'index',
            name: 'Index',
            component: () =>
                import ('@/views/index/index'),
            meta: {
                title: '首页',
                icon: 'mune_home'
            },
            alwaysShow: true
        }]
    },
    {
        path: '/userManage',
        component: Layout,
        title: '用户管理',
        redirect: '/userManage/userList',
        permissions: true,
        meta: {
            icon: 'mune_account',
            title: '用户管理'
        },
        children: [{
            path: 'userList',
            name: 'UserList',
            component: () =>
                import ('@/views/userManage/userList/index'),
            meta: {
                title: '用户列表'
            },
            auth: 'USER_LIST',
            permissions: false
        }]
    },
    {
        path: '/authorityManage',
        component: Layout,
        redirect: '/authorityManage/roleList',
        meta: {
            title: '权限管理',
            icon: 'mune_permissions'
        },
        permissions: true,
        children: [{
                path: 'roleList',
                name: 'RoleList',
                component: () =>
                    import ('@/views/authorityManage/roleList/index'),
                meta: {
                    title: '角色列表'
                },
                auth: 'PERMISSION_MANAGEMENT:ROLE_LIST',
                permissions: false
            },
            {
                path: 'managerList',
                component: () =>
                    import ('@/views/authorityManage/managerList/index'),
                name: 'ManagerList',
                meta: {
                    title: '管理员列表'
                },
                auth: 'PERMISSION_MANAGEMENT:MANAGER_LIST',
                permissions: false
            }
        ]
    },
    {
        path: '/joinManage',
        component: Layout,
        redirect: '/joinManage/joinList',
        meta: {
            title: '加盟商管理',
            icon: 'mune_agent'
        },
        permissions: true,
        children: [{
                path: 'joinList',
                name: 'JoinList',
                component: () =>
                    import ('@/views/joinManage/joinList/index'),
                meta: {
                    title: '加盟商列表'
                },
                auth: 'AGENT_MANAGEMENT:AGENT_LIST',
                permissions: false
            },
            {
                path: 'joinApplyList',
                name: 'JoinApplyList',
                component: () =>
                    import ('@/views/joinManage/joinApplyList/index'),
                meta: {
                    title: '加盟商申请列表'
                },
                auth: 'AGENT_MANAGEMENT:APPLY_AGENT_LIST',
                permissions: false
            },
            {
                path: 'powerApplyList',
                name: 'PowerApplyList',
                component: () =>
                    import ('@/views/joinManage/powerApplyList/index'),
                meta: {
                    title: '充电宝申请列表'
                },
                auth: 'AGENT_MANAGEMENT:APPLY_REISSUE_LIST',
                permissions: false
            },
            {
                path: 'commercialTanentInfo',
                name: 'CommercialTanentInfo',
                component: () =>
                    import ('@/views/joinManage/commercialTanentInfo/index'),
                meta: {
                    title: '商铺信息'
                },
                auth: 'AGENT_MANAGEMENT:STORE_LIST',
                permissions: false
            },
            {
                path: 'outWarehouse',
                name: 'OutWarehouse',
                component: () =>
                    import ('@/views/joinManage/outWarehouse/index'),
                meta: {
                    title: '出库记录'
                },
                auth: 'AGENT_MANAGEMENT:OUTBOUND_LIST',
                permissions: false
            }
        ]
    },
    {
        path: '/equipManage',
        component: Layout,
        redirect: '/equipManage/deviceType',
        meta: {
            title: '设备管理',
            icon: 'mune_eqm'
        },
        permissions: true,
        children: [{
                path: 'deviceType',
                name: 'DeviceType',
                component: () =>
                    import ('@/views/equipManage/deviceType/index'),
                meta: {
                    title: '设备类型'
                },
                auth: 'DEVICE_MANAGEMENT:DEVICE_TYPE_LIST',
                permissions: false
            },
            {
                path: 'productionBatch',
                name: 'ProductionBatch',
                component: () =>
                    import ('@/views/equipManage/productionBatch/index'),
                meta: {
                    title: '生产批次'
                },
                auth: 'DEVICE_MANAGEMENT:BATCH_LIST',
                permissions: false
            },
            {
                path: 'rackList',
                name: 'RackList',
                component: () =>
                    import ('@/views/equipManage/rackList/index'),
                meta: {
                    title: '机柜列表'
                },
                auth: 'DEVICE_MANAGEMENT:CABINET_LIST',
                permissions: false
            },
            {
                path: 'powerList',
                name: 'PowerList',
                hiddle: true,
                component: () =>
                    import ('@/views/equipManage/powerList/index'),
                meta: {
                    title: '充电宝列表'
                }
            },
            {
                path: 'warningList',
                name: 'WarningList',
                component: () =>
                    import ('@/views/equipManage/warningList/index'),
                meta: {
                    title: '告警列表'
                },
                auth: 'DEVICE_MANAGEMENT:WARN_LIST',
                permissions: false
            }
        ]
    },
    {
        path: '/orderManage',
        component: Layout,
        title: '订单管理',
        redirect: '/orderManage/orderList',
        meta: {
            title: '订单管理',
            icon: 'mune_order'
        },
        permissions: true,
        children: [{
            path: 'orderList',
            name: 'OrderList',
            component: () =>
                import ('@/views/orderManage/orderList/index'),
            meta: {
                title: '订单列表'
            },
            auth: 'ORDER_MANAGEMENT:ORDER_LIST',
            permissions: false
        }]
    },
    {
        path: '/settleManage',
        component: Layout,
        redirect: '/settleManage/dividedRecord',
        meta: {
            title: '结算管理',
            icon: 'mune_settlement'
        },
        permissions: true,
        children: [{
                path: 'dividedRecord',
                name: 'DividedRecord',
                component: () =>
                    import ('@/views/settleManage/dividedRecord/index'),
                meta: {
                    title: '分成记录'
                },
                auth: 'COUNT_MANAGEMENT:SETTLE_LIST',
                permissions: false
            },
            {
                path: 'withdrawList',
                name: 'WithdrawList',
                component: () =>
                    import ('@/views/settleManage/withdrawList/index'),
                meta: {
                    title: '提现列表'
                },
                auth: 'COUNT_MANAGEMENT:WITHDRAW_LIST',
                permissions: false
            },
            {
                path: 'statisticalGraph',
                name: 'StatisticalGraph',
                component: () =>
                    import ('@/views/settleManage/statisticalGraph/index'),
                meta: {
                    title: '统计图表'
                },
                auth: 'COUNT_MANAGEMENT:STATISTICAL_GRAPH',
                permissions: false
            }
        ]
    },
    {
        path: '/systemManage',
        component: Layout,
        redirect: '/systemManage/chargingRuleSetting',
        meta: {
            title: '系统管理',
            icon: 'mune_sys'
        },
        permissions: true,
        children: [{
                path: 'chargingRuleSetting',
                name: 'ChargingRuleSetting',
                component: () =>
                    import ('@/views/systemManage/chargingRuleSetting/index'),
                meta: {
                    title: '规则设置'
                },
                auth: 'SYSTEM_MANAGEMENT:RULE_CONFIG',
                permissions: false
            },
            {
                path: 'frequentlyQuestions',
                name: 'FrequentlyQuestions',
                component: () =>
                    import ('@/views/systemManage/frequentlyQuestions/index'),
                meta: {
                    title: '常见问题设置'
                },
                auth: 'SYSTEM_MANAGEMENT:FAQ_CONFIG',
                permissions: false
            },
            {
                path: 'systemLogs',
                name: 'SystemLogs',
                component: () =>
                    import ('@/views/systemManage/systemLogs/index'),
                meta: {
                    title: '系统日志'
                },
                auth: 'SYSTEM_MANAGEMENT:SYSTEM_LOG',
                permissions: false
            },
            {
                path: 'firmwareUpdate',
                name: 'FirmwareUpdate',
                component: () =>
                    import ('@/views/systemManage/firmwareUpdate/index'),
                meta: {
                    title: '固件升级'
                },
                auth: 'SYSTEM_MANAGEMENT:FIRMWARE_UPGRADE',
                permissions: false
            },
            {
                path: 'adviceFeedback',
                name: 'AdviceFeedback',
                component: () =>
                    import ('@/views/systemManage/adviceFeedback/index'),
                meta: {
                    title: '意见反馈'
                },
                auth: 'SYSTEM_MANAGEMENT:SUGGESTION_FEEDBACK',
                permissions: false
            },
            {
                path: 'adList',
                name: 'AdList',
                component: () =>
                    import ('@/views/systemManage/adList/index'),
                meta: {
                    title: '广告列表'
                },
                auth: 'SYSTEM_MANAGEMENT:ADD_LIST',
                permissions: false
            }
        ]
    },
]

const createRouter = () => new Router({
    routes: constantRoutes
})

const router = createRouter()

export default router