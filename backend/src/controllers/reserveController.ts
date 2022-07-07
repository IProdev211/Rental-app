import { Request } from 'express'
import { firestore, auth } from 'firebase-admin'

class ReserveController {
  addReserve = async (req: Request) => {
    try {
      const { from, to, user, bike } = req.body

      const ref = await firestore().collection('reserves').add({
        from,
        to,
        user,
        bike
      })

      const promises = [
        new Promise((resolve, reject) => {
          firestore().collection('bikes').doc(bike as string).get().then((doc) => {
            resolve({
              ...doc.data(),
              id: bike
            })
          })
        }),
        new Promise((resolve, reject) => {
          firestore().collection('users').doc(user as string).get().then((doc) => {
            resolve({
              ...doc.data(),
              id: user
            })
          })
        })
      ]

      const res = await Promise.all(promises)

      return {
        success: true,
        newReserve: {
          from,
          to,
          user: res[1],
          bike: res[0],
          id: ref.id
        }
      }
    } catch (err) {
      console.log(err)
      throw new Error('Error in addReserve!')
    }
  };

  getReserves = async (req: Request) => {
    try {
      const { role } = req.body
      if (role !== 'manager') {
        throw new Error('Permission Error')
      }
      const snap = await firestore().collection('reserves').get()
      const promises = snap.docs.map((doc) => {
        return new Promise((resolve, reject) => {
          const reserveData = doc.data()
          const reserveId = doc.id;

          firestore().collection('bikes').doc(reserveData?.bike).get().then((bikeDoc) => {
            const bikeData = {
              ...bikeDoc.data(),
              id: reserveData?.bike
            }

            firestore().collection('users').doc(reserveData?.user as string).get().then((userDoc) => {
              const userData = { ...userDoc.data(), id: reserveData?.user }

              resolve({
                ...reserveData,
                id: reserveId,
                bike: bikeData,
                user: userData
              })
            })
          })
        })
      })

      const reserves = await Promise.all(promises)

      return {
        success: true,
        reserves: reserves
      }
    } catch (err) {
      console.log(err)
      throw new Error('Error in getReserves!')
    }
  };

  getMyReserves = async (req: Request) => {
    try {
      const { id } = req.query;

      const snap = await firestore().collection('reserves').where('user', '==', id).get()
      const promises = snap.docs.map((doc) => {
        return new Promise((resolve, reject) => {
          const reserveData = doc.data()
          const reserveId = doc.id;

          firestore().collection('bikes').doc(reserveData?.bike).get().then((bikeDoc) => {
            const bikeData = {
              ...bikeDoc.data(),
              id: reserveData?.bike
            }

            firestore().collection('users').doc(id as string).get().then((userDoc) => {
              const userData = { ...userDoc.data(), id }

              resolve({
                ...reserveData,
                id: reserveId,
                bike: bikeData,
                user: userData
              })
            })
          })
        })
      })

      const reserves = await Promise.all(promises)

      return {
        success: true,
        reserves: reserves
      }
    } catch (err) {
      console.log(err)
      throw new Error('Error in getMyReserves!')
    }
  };

  cancelReserve = async (req: Request) => {
    try {
      const { id, bike, newRating } = req.body;

      console.log(id, bike, newRating)
      const bikeRef = firestore().collection('bikes').doc(bike)
      const promises = [
        firestore().collection('reserves').doc(id).delete(),
        new Promise<void>((resolve, reject) => {
          bikeRef.get().then((bikeDoc) => {
            const bikeData = bikeDoc.data()
            const rating = bikeData?.rating || 0
            const rating_number = bikeData?.rating_number || 0
            bikeRef.set({
              ...bikeData,
              rating: Math.floor((rating_number * rating + newRating) / (rating_number + 1)),
              rating_number: rating_number + 1
            }).then(() => {
              resolve()
            })
          })
        })
      ]

      await Promise.all(promises)
      const newBike = (await bikeRef.get()).data()

      return {
        success: true,
        bike: {
          ...newBike,
          id: bike
        }
      }
    } catch (err) {
      console.log(err)
      throw new Error('Error in cancelReserve!')
    }
  }
}

export = new ReserveController()