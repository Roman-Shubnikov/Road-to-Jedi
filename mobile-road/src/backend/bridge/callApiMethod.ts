import bridge from '@vkontakte/vk-bridge';
import { VK_API_VERSION } from '../../config';

export const callApiVk = async (method: string, addition_params: {}, access_token: string) => {
    const params = {
        ...addition_params,
        v: VK_API_VERSION,
        access_token,
    }
    return (bridge.send('VKWebAppCallAPIMethod', {
        method,
        params,
    })
    .then(res => res.response))
}