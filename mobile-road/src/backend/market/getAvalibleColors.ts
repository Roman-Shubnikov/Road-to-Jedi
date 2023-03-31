import { apiMarket } from '.'
import { checkResponse } from '../func'
import { jsonAuth } from '../headers'

export const getAvalibleColors = async () => {
    return fetch(`${apiMarket}/getAvalibleColors`, {
      method: 'GET',
      headers: jsonAuth,
    }).then(checkResponse)
}