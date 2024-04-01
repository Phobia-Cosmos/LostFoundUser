import request from '@/utils/request'

export function publishItem(data) {
    return request({
        url: '/user/v2/item',
        method: 'post',
        data
    })
}

export function uploadItemPicture(data) {
    return request({
        url: '/user/v2/item/upload',
        method: 'post',
        data
    })
}

export function modifyItem(data) {
    return request({
        url: '/user/v2/item',
        method: 'put',
        data
    })
}

export function finishItem(data) {
    return request({
        url: '/user/v2/item/finish',
        method: 'put',
        data: {
            id: data
        }
    })
}

export function deleteItem(ids) {
    return request({
        url: '/user/v2/item',
        method: 'delete',
        params: {
            ids: ids
        }
    })
}

export function userGetItemById(id) {
    return request({
        url: `/user/v2/item/${id}`,
    })
}

export function userPageQuery(params) {
    return request({
        url: `/user/v2/item/page`,
        params
    })
}
