import { Request } from 'express'
import { firestore, auth } from 'firebase-admin'

class BikeInfoController {
  getConstants = async (req: Request) => {
    try {
      const promises = [
        new Promise((resolve, reject) => {
          firestore().collection('colors').get().then((res) => {
            const docs = res.docs
            const colors = docs.map((doc) => doc.data()?.color)
            resolve(colors)
          })
        }),
        new Promise((resolve, reject) => {
          firestore().collection('locations').get().then((res) => {
            const docs = res.docs
            const locations = docs.map((doc) => doc.data()?.location)
            resolve(locations)
          })
        }),
        new Promise((resolve, reject) => {
          firestore().collection('models').get().then((res) => {
            const docs = res.docs
            const models = docs.map((doc) => doc.data()?.model)
            resolve(models)
          })
        }),
      ]

      const data = await Promise.all(promises)

      return {
        success: true,
        data
      }
    } catch (err) {
      console.log(err)
      throw new Error('Error in getConstants!')
    }
  }
}

export = new BikeInfoController()