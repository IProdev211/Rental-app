export type TBike = {
    id: string
    model: string
    color: string
    location: string
    rating: number
    rating_number: number
    isForRental: boolean
}

export type TReserve = {
    id: string
    user: TUser
    bike: TBike,
    from: number
    to: number
}

export type TUser = {
    id: string
    email: string
    name: string
    role: string
}

export type AxiosResponseType = {
    success: boolean
    [key: string]: any
}


export type TAuthState = {
    isLoggedIn: boolean
    userInfo: TUser,
    loading: boolean
}

export type TBikeState = {
    constants: {
        locations: string[]
        models: string[]
        colors: string[]
    },
    availableBikes: TBike[]
    bikes: TBike[]
    loading: boolean
}

export type TUserState = {
    users: TUser[]
    loading: boolean
}

export type TReserveState = {
    reserves: TReserve[]
    myReserves: TReserve[]
    loading: boolean
}

export interface TableColumn {
    id: string;
    label: string;
    minWidth?: number;
    align?: 'right' | 'left' | 'center';
    format?: (value: any) => any;
}