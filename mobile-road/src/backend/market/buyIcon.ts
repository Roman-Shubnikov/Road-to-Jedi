import { apiMarket } from '.'
import { checkResponse } from '../func'
import { jsonAuth } from '../headers'

export const buyIcon = async (icon_name: string) => {
    return fetch(`${apiMarket}/buyIcon/${icon_name}`, {
      method: 'POST',
      headers: jsonAuth,
    }).then(checkResponse)
}