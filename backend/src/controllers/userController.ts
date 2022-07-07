import { Request } from 'express'
import { firestore, auth } from 'firebase-admin'

class UserController {
  addUser = async (req: Request) => {
    try {
      const { user, role } = req.body
      if (role !== 'manager') {
        throw new Error('Permission Error')
      }

      const userRecord = await auth().createUser({
        email: user.email,
        emailVerified: true,
        password: user.password,
        displayName: user.name,
      })

      const uid = userRecord.uid

      await firestore().collection('users').doc(uid).set({
        ...user,
      })

      return {
        success: true,
        newUser: {
          ...user,
          id: uid
        }
      }
    } catch (err: any) {
      console.log(err?.message)
      return {
        success: false,
        error: err?.message
      }
    }
  };

  editUser = async (req: Request) => {
    try {
      const { user, role } = req.body
      if (role !== 'manager') {
        throw new Error('Permission Error')
      }

      await auth().updateUser(user.id, {
        email: user.email,
      })

      await firestore().collection('users').doc(user.id).set({
        ...user,
      }, { merge: true })

      return {
        success: true
      }
    } catch (err: any) {
      console.log(err)
      return {
        success: false,
        error: err?.message
      }
    }
  };

  deleteUser = async (req: Request) => {
    try {
      const { users, role } = req.body
      if (role !== 'manager') {
        throw new Error('Permission Error')
      }

      const promises = users.map((user: any) => firestore().collection('users').doc(user).delete())

      await auth().deleteUsers(users)
      await Promise.all(promises)

      return {
        success: true
      }
    } catch (err) {
      console.log(err)
      throw new Error('Error in deleteUsers!')
    }
  }

  getUsers = async (req: Request) => {
    try {
      const { role } = req.body;
      if (role !== 'manager') {
        throw new Error('Permission Error')
      }
      const snap = await firestore().collection('users').get()
      const docs = snap.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      }))

      return {
        success: true,
        users: docs
      }
    } catch (err) {
      console.log(err)
      throw new Error('Error in getUsers!')
    }
  }

  getUser = async (req: Request) => {
    try {
      const { id } = req.query
      const user = (await firestore().collection('users').doc(id as string).get()).data()

      return {
        success: true,
        user: {
          ...user,
          id
        }
      }
    } catch (err) {
      console.log(err)
      throw new Error('Error in getUser!')
    }
  }
}

export = new UserController()