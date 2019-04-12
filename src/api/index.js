import axiosAjax from "common/js/axios"

export default function getChatRecord( params ) {
    const configParams = {
        method: 'post',
        url: '/im/chat/record',
        data: params,
        unresponse: true
    };
    return axiosAjax(configParams)
}
