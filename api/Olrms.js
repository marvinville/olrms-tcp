import axios from 'axios'
import md5 from 'md5'
import moment from 'moment'

const date = new Date()
const today = moment(date).add(8, 'hours').format('YYYY-MM-DD HH:mm:ss')

export default class Olrms {
  constructor() {
    this.authorization = md5('olrmsgps')
    this.url = 'http://gps.olrms.com/gps/getdeviceinfo'
  }
  parseGprs({ data }) {
    if (data) {
      const gps = data.split(',')
      const imei = gps[1] || ''
      if (imei) {
        const lat = gps[4] || ''
        const lng = gps[5] || ''
        const network = gps[16] || ''

        const networkData = network.split('|')
        const mcc = networkData[0] || ''
        const mnc = networkData[1] || ''

        return {
          imei: imei,
          lat: lat,
          lng: lng,
          mcc: mcc,
          mnc: mnc,
        }
      }
    }
    return false
  }
  createGpsData({ data }) {
    const gprs = this.parseGprs({ data })
    if (gprs) {
      return {
        device_info: {
          batt_level: '',
          dt: [
            {
              date_time: today,
            },
          ],
          imei: gprs.imei,
          laccid: [
            {
              lac: 0,
              cid: 0,
            },
          ],
          latlng: [
            {
              lat: gprs.lat,
              lng: gprs.lng,
            },
          ],
          mac_address: gprs.imei,
          mcc: gprs.mcc,
          mnc: gprs.mnc,
        },
      }
    }

    return false
  }
  async sendToApi({ data }) {
    const payLoad = this.createGpsData({ data })
    try {
      if (payLoad) {
        const response = await axios({
          method: 'POST',
          headers: {
            Auth: this.authorization,
            'Content-Type': 'application/json',
          },
          data: payLoad,
          url: this.url,
        })
        if (response.status !== 200) {
          console.error(`Status: ${response.status}`)
          return false
        }
        console.log(response.data)
        return true
      }
    } catch (error) {
      console.error(error)
    }
  }
}
