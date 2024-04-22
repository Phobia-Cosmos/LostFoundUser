import request from '@/utils/request'

export function selectUserGroup() {
    return request({
        url: `/chatGroup/selectUserGroup`,
    })
}

export function deleteUserGroup(id) {
    return request({
        url: `/chatGroup/delete/${id}`,
        method: 'delete'
    })
}

export function selectUserChat(id) {
    return request({
        url: `/chatInfo/selectUserChat/${id}`,
    })
}

export function updateRead(id) {
    return request({
        url: `/chatInfo/updateRead/${id}`,
        method: 'put',
    })
}

// -------------------------------------------------------------------------------------
export function publishMessage(data) {
    return request({
        url: '/user/v2/message',
        method: 'post',
        data
    })
}

export function deleteMessage(data) {
    return request({
        url: '/user/v2/message',
        method: 'delete',
        data
    })
}

export function loadOld(params) {
    return request({
        url: `/user/v2/message/old`,
        params
    })
}

export function loadNew(params) {
    return request({
        url: `/user/v2/message/new`,
        params
    })
}
