import { apiMarket } from '.'
import { checkResponse } from '../func'
import { jsonAuth } from '../headers'

export const installAvatar = async (hash: string) => {
    return fetch(`${apiMarket}/installAvatar/${hash}`, {
      method: 'POST',
      headers: jsonAuth,
    }).then(checkResponse)
}