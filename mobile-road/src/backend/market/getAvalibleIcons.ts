import { apiMarket } from '.'
import { checkResponse } from '../func'
import { jsonAuth } from '../headers'

export const getAvalibleIcons = async () => {
    return fetch(`${apiMarket}/getAvalibleIcons`, {
      method: 'GET',
      headers: jsonAuth,
    }).then(checkResponse)
}