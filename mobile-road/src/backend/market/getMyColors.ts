import { apiMarket } from '.'
import { checkResponse } from '../func'
import { jsonAuth } from '../headers'

export const getMyColors = async () => {
    return fetch(`${apiMarket}/getMyColors`, {
      method: 'GET',
      headers: jsonAuth,
    }).then(checkResponse)
}