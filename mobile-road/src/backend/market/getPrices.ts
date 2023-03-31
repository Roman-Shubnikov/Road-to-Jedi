import { apiMarket } from '.'
import { checkResponse } from '../func'
import { jsonAuth } from '../headers'

export const getPrices = async () => {
    return fetch(`${apiMarket}/getPrices`, {
      method: 'GET',
      headers: jsonAuth,
    }).then(checkResponse)
}