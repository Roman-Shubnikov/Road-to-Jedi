import { apiMarket } from '.'
import { checkResponse } from '../func'
import { jsonAuth } from '../headers'

export const createCustomAvatar = async (color: string, icon_name: string) => {
    return fetch(`${apiMarket}/createCustomAvatar`, {
      method: 'POST',
      headers: jsonAuth,
      body: JSON.stringify({
        color,
        icon_name,
      })
    }).then(checkResponse)
}