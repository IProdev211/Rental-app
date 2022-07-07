import { Request } from 'express'
import { firestore, auth } from 'firebase-admin'

class AuthController {
  signInWithToken = async (req: Request) => {
    try {
      const { idToken }: any = req.body;

      const decodedToken = await auth().verifyIdToken(idToken)
      const uid = decodedToken.uid;

      const user = (await firestore().collection('users').doc(uid).get()).data()

      return {
        success: true,
        user: {
          ...user,
          id: uid
        }
      }
    } catch (err) {
      console.log(err)
      throw new Error('Error in signIn!')
    }
  }

  signUp = async (req: Request) => {
    try {
      const { userInfo }: any = req.body;

      const userRecord = await auth().createUser({
        email: userInfo.email,
        emailVerified: true,
        password: userInfo.password,
        displayName: userInfo.name,
      })

      const uid = userRecord.uid

      await firestore().collection('users').doc(uid).set({
        email: userInfo.email,
        name: userInfo.name,
        role: 'user',
      })

      return {
        success: true,
        userInfo: ({
          email: userInfo.email,
          name: userInfo.name,
          role: userInfo.role,
          id: uid
        })
      }
    } catch (err) {
      console.log(err)
      throw new Error('Error in signup!')
    }
  }
}

export = new AuthController()