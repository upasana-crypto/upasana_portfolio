// src/payload/getPayloadClient.ts
import { getPayload } from 'payload'
import config from '../../payload.config'

export const getPayloadClient = async () => {
  const payload = await getPayload({
    config: config,
  })

  return payload
}
