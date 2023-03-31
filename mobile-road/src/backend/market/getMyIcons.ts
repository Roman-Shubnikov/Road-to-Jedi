import { apiMarket } from '.'
import { checkResponse } from '../func'
import { jsonAuth } from '../headers'

export const getMyIcons = async () => {
    return fetch(`${apiMarket}/getMyIcons`, {
      method: 'GET',
      headers: jsonAuth,
    }).then(checkResponse)
}