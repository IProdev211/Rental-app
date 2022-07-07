import { Router } from 'express';
import AuthRouter from './authRouter';
import BikeInfoRouter from './bikeInfoRouter';
import BikeRouter from './bikeRouter';
import UserRouter from './userRouter';
import ReserveRouter from './reserveRouter';

class MasterRouter {
  private _router = Router();
  private _auth = AuthRouter;
  private _bikeInfo = BikeInfoRouter;
  private _bike = BikeRouter;
  private _user = UserRouter;
  private _reserve = ReserveRouter;

  get router() {
    return this._router;
  }

  constructor() {
    this._configure();
  }

  /**
   * Connect routes to their matching routers.
   */
  private _configure() {
    this._router.use('/', this._auth);
    this._router.use('/', this._bikeInfo);
    this._router.use('/user', this._user);
    this._router.use('/bike', this._bike);
    this._router.use('/reserve', this._reserve);
  }
}

export = new MasterRouter().router;
