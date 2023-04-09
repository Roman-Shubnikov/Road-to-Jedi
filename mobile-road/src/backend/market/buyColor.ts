import { apiMarket } from '.'
import { checkResponse } from '../func'
import { jsonAuth } from '../headers'

export const buyColor = async (color: string) => {
    return fetch(`${apiMarket}/buyColor`, {
      method: 'POST',
      headers: jsonAuth,
      body: JSON.stringify({
        color,
      })
    }).then(checkResponse)
}