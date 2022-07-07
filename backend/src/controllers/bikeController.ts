import { Request } from 'express'
import { firestore, auth } from 'firebase-admin'

class BikeController {
  addBike = async (req: Request) => {
    try {
      const { bike, role } = req.body
      if (role !== 'manager') {
        throw new Error('Permission Error')
      }

      const ref = await firestore().collection('bikes').add({
        ...bike,
        rating: 0,
        isForRental: false
      })

      return {
        success: true,
        newBike: {
          ...bike,
          rating: 0,
          isForRental: false,
          id: ref.id
        }
      }
    } catch (err) {
      console.log(err)
      throw new Error('Error in addBike!')
    }
  };

  editBike = async (req: Request) => {
    try {
      const { bike, role } = req.body
      if (role !== 'manager') {
        throw new Error('Permission Error')
      }

      await firestore().collection('bikes').doc(bike.id).set({
        ...bike,
      }, { merge: true })

      return {
        success: true
      }
    } catch (err) {
      console.log(err)
      throw new Error('Error in editBike!')
    }
  };

  deleteBike = async (req: Request) => {
    try {
      const { bikes, role } = req.body
      if (role !== 'manager') {
        throw new Error('Permission Error')
      }

      const promises = bikes.map((bike: any) => firestore().collection('bikes').doc(bike.id).delete())

      await Promise.all(promises)

      return {
        success: true
      }
    } catch (err) {
      console.log(err)
      throw new Error('Error in deleteBikes!')
    }
  }

  getBikes = async (req: Request) => {
    try {
      const { role } = req.body
      if (role !== 'manager') {
        throw new Error('Error in getBikes! Permission Error')
      }

      const snap = await firestore().collection('bikes').get()
      const docs = snap.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      }))

      return {
        success: true,
        bikes: docs
      }
    } catch (err) {
      console.log(err)
      throw new Error('Error in getBikes!')
    }
  }

  getFilteredBikes = async (req: Request) => {
    try {
      const {
        from,
        to,
        model,
        location,
        color,
        rating
      } = req.query
      let query = firestore().collection('bikes').where('isForRental', '==', true)

      if (model) {
        query = query.where('model', '==', model)
      }

      if (location) {
        query = query.where('location', '==', location)
      }

      if (color) {
        query = query.where('color', '==', color)
      }

      if (rating) {
        query = query.where('rating', '==', Number(rating))
      }

      let rentedBikes: string[] = []

      if (from && to) {
        rentedBikes =
          (await firestore().collection('reserves').get()).docs
            .map((doc) => doc.data())
            .filter((item) => item && !(item.to <= Number(from) && item.to <= Number(to) || item.from >= Number(from) && item.from >= Number(to)))
            .map((item) => item.bike)
      } else {
        rentedBikes =
          (await firestore().collection('reserves').get()).docs
            .map((doc) => doc.data())
            .map((item) => item.bike)
      }

      console.log(rentedBikes)

      rentedBikes = [...new Set(rentedBikes)]


      if (rentedBikes.length) {
        query = query.where('id', 'not-in', rentedBikes)
      }

      const snap = await query.get()
      if (snap.empty) {
        return {
          success: true,
          bikes: []
        }
      }

      const docs = snap.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      }))

      return {
        success: true,
        bikes: docs
      }
    } catch (err) {
      console.log(err)
      throw new Error('Error in getFilteredBikes!')
    }
  }
}

export = new BikeController()