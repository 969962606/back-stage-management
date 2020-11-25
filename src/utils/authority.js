const authority = [
    {
        label: '用户列表',
        flag: false,
        auth: 'USER_LIST',
        level: '0',
        path: 'userManage/userList',
        secondTitle: [{
            label: '导出',
            flag: false,
            auth: 'USER_LIST:EXPORT',
            level: '0-0',
        }]
    },
    {
        label: '权限管理',
        flag: false,
        auth: 'PERMISSION_MANAGEMENT',
        level: '1',
        secondTitle: [{
                label: '角色列表',
                flag: false,
                auth: 'PERMISSION_MANAGEMENT:ROLE_LIST',
                path: 'authorityManage/roleList',
                level: '1-0',
                items: [{
                        label: '新增',
                        flag: false,
                        auth: 'PERMISSION_MANAGEMENT:ROLE:ADD',
                        level: '1-0-0'
                    },
                    {
                        label: '编辑',
                        flag: false,
                        auth: 'PERMISSION_MANAGEMENT:ROLE:EDIT',
                        level: '1-0-2'
                    },
                    {
                        label: '设置权限',
                        flag: false,
                        auth: 'PERMISSION_MANAGEMENT:ROLE:ALLOCATION',
                        level: '1-0-1'
                    },
                    {
                        label: '删除',
                        flag: false,
                        auth: 'PERMISSION_MANAGEMENT:ROLE:DELETE',
                        level: '1-0-3'
                    }
                ]
            },
            {
                label: '管理员列表',
                flag: false,
                auth: 'PERMISSION_MANAGEMENT:MANAGER_LIST',
                path: 'authorityManage/managerList',
                level: '1-1',
                items: [{
                        label: '新增',
                        flag: false,
                        auth: 'PERMISSION_MANAGEMENT:MANAGER:ADD',
                        level: '1-1-0'
                    },
                    {
                        label: '删除',
                        flag: false,
                        auth: 'PERMISSION_MANAGEMENT:MANAGER:DELETE',
                        level: '1-1-1'
                    }
                ]
            }
        ]
    },
    {
        label: '加盟商管理',
        flag: false,
        auth: 'AGENT_MANAGEMENT',
        level: '2',
        secondTitle: [{
                label: '加盟商列表',
                flag: false,
                auth: 'AGENT_MANAGEMENT:AGENT_LIST',
                path: 'joinManage/joinList',
                level: '2-0',
                items: [{
                        label: '新增',
                        flag: false,
                        auth: 'AGENT_MANAGEMENT:AGENT:ADD',
                        level: '2-0-0'
                    },
                    {
                        label: '编辑',
                        flag: false,
                        auth: 'AGENT_MANAGEMENT:AGENT:EDIT',
                        level: '2-0-1'
                    },
                    {
                        label: '禁用/恢复',
                        flag: false,
                        auth: 'AGENT_MANAGEMENT:AGENT:AGENT_STATUS',
                        level: '2-0-2'
                    }
                ]
            },
            {
                label: '加盟商申请列表',
                flag: false,
                auth: 'AGENT_MANAGEMENT:APPLY_AGENT_LIST',
                path: 'joinManage/joinApplyList',
                level: '2-1',
                items: [{
                    label: '通过/拒绝',
                    flag: false,
                    auth: 'AGENT_MANAGEMENT:APPLY_AGENT:AUDIT_STATUS',
                    level: '2-1-0'
                }]
            },
            {
                label: '充电宝申请列表',
                flag: false,
                auth: 'AGENT_MANAGEMENT:APPLY_REISSUE_LIST',
                path: 'joinManage/powerApplyList',
                level: '2-2',
                items: [{
                    label: '补发/拒绝',
                    flag: false,
                    auth: 'AGENT_MANAGEMENT:APPLY_REISSUE:AUDIT_STATUS',
                    level: '2-2-0'
                }]
            },
            {
                label: '商户信息',
                flag: false,
                auth: 'AGENT_MANAGEMENT:STORE_LIST',
                path: 'joinManage/commercialTanentInfo',
                level: '2-3',
                items: [{
                        label: '分成记录',
                        flag: false,
                        auth: 'AGENT_MANAGEMENT:STORE:DIVIDED',
                        level: '2-3-0'
                    },
                    {
                        label: '编辑',
                        flag: false,
                        auth: 'AGENT_MANAGEMENT:STORE:EDIT',
                        level: '2-3-1'
                    },
                    {
                        label: '删除',
                        flag: false,
                        auth: 'AGENT_MANAGEMENT:STORE:DELETE',
                        level: '2-3-2'
                    }
                ]
            },
            {
                label: '出库记录',
                flag: false,
                auth: 'AGENT_MANAGEMENT:OUTBOUND_LIST',
                path: 'joinManage/outWarehouse',
                level: '2-3',
                items: [{
                    label: '新增',
                    flag: false,
                    auth: 'AGENT_MANAGEMENT:OUTBOUND:ADD',
                    level: '2-3-0'
                }]
            }
        ]
    },
    {
        label: '设备管理',
        flag: false,
        auth: 'DEVICE_MANAGEMENT',
        level: '3',
        secondTitle: [{
                label: '设备类型',
                flag: false,
                auth: 'DEVICE_MANAGEMENT:DEVICE_TYPE_LIST',
                path: 'equipManage/deviceType',
                level: '3-0',
                items: [{
                        label: '新增',
                        flag: false,
                        auth: 'DEVICE_MANAGEMENT:DEVICE_TYPE:ADD',
                        level: '3-0-0'
                    },
                    {
                        label: '编辑',
                        flag: false,
                        auth: 'DEVICE_MANAGEMENT:DEVICE_TYPE:EDIT',
                        level: '3-0-1'
                    },
                    {
                        label: '删除',
                        flag: false,
                        auth: 'DEVICE_MANAGEMENT:DEVICE_TYPE:DELETE',
                        level: '3-0-2'
                    }
                ]
            },
            {
                label: '生产批次',
                flag: false,
                auth: 'DEVICE_MANAGEMENT:BATCH_LIST',
                path: 'equipManage/productionBatch',
                level: '3-1',
                items: [{
                        label: '新增',
                        flag: false,
                        auth: 'DEVICE_MANAGEMENT:BATCH:ADD',
                        level: '3-1-0'
                    },
                    {
                        label: '编辑',
                        flag: false,
                        auth: 'DEVICE_MANAGEMENT:BATCH:EDIT',
                        level: '3-1-1'
                    },
                    {
                        label: '删除',
                        flag: false,
                        auth: 'DEVICE_MANAGEMENT:BATCH:DELETE',
                        level: '3-1-2'
                    },
                    {
                        label: '导出二维码',
                        flag: false,
                        auth: 'DEVICE_MANAGEMENT:BATCH:EXPORT_QRCODE',
                        level: '3-1-3'
                    }
                ]
            },
            {
                label: '机柜列表',
                flag: false,
                auth: 'DEVICE_MANAGEMENT:CABINET_LIST',
                path: 'equipManage/rackList',
                level: '3-2',
                items: [{
                        label: '编辑',
                        flag: false,
                        auth: 'DEVICE_MANAGEMENT:CABINET:EDIT',
                        level: '3-2-0'
                    },
                    {
                        label: '报损',
                        flag: false,
                        auth: 'DEVICE_MANAGEMENT:CABINET:BREAKAGE',
                        level: '3-2-1'
                    },
                    {
                        label: '删除',
                        flag: false,
                        auth: 'DEVICE_MANAGEMENT:CABINET:DELETE',
                        level: '3-2-2'
                    },
                    {
                        label: '禁用/恢复',
                        flag: false,
                        auth: 'DEVICE_MANAGEMENT:CABINET:CABINET_STATUS',
                        level: '3-2-3'
                    },
                    {
                        label: '查看充电宝',
                        flag: false,
                        auth: 'DEVICE_MANAGEMENT:CABINET:VIEW_POWERBANKS',
                        level: '3-2-4'
                    },
                ]
            },
            {
                label: '告警列表',
                flag: false,
                auth: 'DEVICE_MANAGEMENT:WARN_LIST',
                path: 'equipManage/warningList',
                level: '3-3'
            }
        ]
    },
    {
        label: '订单管理',
        flag: false,
        auth: 'ORDER_MANAGEMENT',
        level: '4',
        secondTitle: [{
            label: '订单列表',
            flag: false,
            auth: 'ORDER_MANAGEMENT:ORDER_LIST',
            path: 'orderManage/orderList',
            level: '4-0',
            items: [{
                label: '退款/结束',
                flag: false,
                auth: 'ORDER_MANAGEMENT:ORDER:ORDER_STATUS',
                level: '4-0-0',
            }]
        }]
    },
    {
        label: '结算管理',
        flag: false,
        auth: 'COUNT_MANAGEMENT',
        level: '5',
        secondTitle: [{
                label: '分成记录',
                flag: false,
                auth: 'COUNT_MANAGEMENT:SETTLE_LIST',
                path: 'settleManage/dividedRecord',
                level: '5-0',
            },
            {
                label: '提现列表',
                flag: false,
                auth: 'COUNT_MANAGEMENT:WITHDRAW_LIST',
                path: 'settleManage/withdrawList',
                level: '5-1',
                items: [{
                    label: '通过/驳回',
                    flag: false,
                    auth: 'COUNT_MANAGEMENT:WITHDRAW:WITHDRAW_STATUS',
                    level: '5-2'
                }]
            },
            {
                label: '统计图表',
                flag: false,
                auth: 'COUNT_MANAGEMENT:STATISTICAL_GRAPH',
                path: 'settleManage/statisticalGraph',
                level: '5-2'
            }
        ]
    },
    {
        label: '系统管理',
        flag: false,
        auth: 'SYSTEM_MANAGEMENT',
        level: '6',
        secondTitle: [{
                label: '规则设置',
                flag: false,
                auth: 'SYSTEM_MANAGEMENT:RULE_CONFIG',
                path: 'systemManage/chargingRuleSetting',
                level: '6-0',
            },
            {
                label: '常见问题设置',
                flag: false,
                auth: 'SYSTEM_MANAGEMENT:FAQ_CONFIG',
                path: 'systemManage/frequentlyQuestions',
                level: '6-1',
            },
            {
                label: '系统日志',
                flag: false,
                auth: 'SYSTEM_MANAGEMENT:SYSTEM_LOG',
                path: 'systemManage/systemLogs',
                level: '6-2',
            },
            {
                label: '固件升级',
                flag: false,
                auth: 'SYSTEM_MANAGEMENT:FIRMWARE_UPGRADE',
                path: 'systemManage/firmwareUpdate',
                level: '6-3',
            },
            {
                label: '意见反馈',
                flag: false,
                auth: 'SYSTEM_MANAGEMENT:SUGGESTION_FEEDBACK',
                path: 'systemManage/adviceFeedback',
                level: '6-4',
            },
            {
                label: '广告列表',
                flag: false,
                auth: 'SYSTEM_MANAGEMENT:ADD_LIST',
                path: 'systemManage/adList',
                level: '6-5',
            }
        ]
    }
]

export { authority }