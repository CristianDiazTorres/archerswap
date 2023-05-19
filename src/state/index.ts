import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { save, load } from 'redux-localstorage-simple'

import farmsReducer from './farms'
import toastsReducer from './toasts'
import poolsReducer from './pools'
import vaultsReducer from './vaults'
import pricesReducer from './prices'
import profileReducer from './profile'
import teamsReducer from './teams'
import achievementsReducer from './achievements'
import blockReducer from './block'
import allTimeVolumeReducer from './allTimeVolume'
import oneDayVolumeReducer from './oneDayVolume'

// exchange reducers
import application from './application/reducer'
import { updateVersion } from './global/actions'
import user from './user/reducer'
import transactions from './transactions/reducer'
import swap from './swap/reducer'
import mint from './mint/reducer'
import lists from './lists/reducer'
import burn from './burn/reducer'
import multicall from './multicall/reducer'


import { getThemeCache } from '../utils/theme'

type MergedState = {
  [key: string]: {
    [key: string]: any
  }
}
const PERSISTED_KEYS: string[] = ['user', 'transactions']
const loadedState = load({ states: PERSISTED_KEYS }) as MergedState
if (loadedState.user) {
  loadedState.user.userDarkMode = getThemeCache()
}

const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: {
    farms: farmsReducer,
    toasts: toastsReducer,
    pools: poolsReducer,
    vaults: vaultsReducer,
    prices: pricesReducer,
    profile: profileReducer,
    teams: teamsReducer,
    achievements: achievementsReducer,
    block: blockReducer,
    allTimeVolume: allTimeVolumeReducer,
    oneDayVolume: oneDayVolumeReducer,
    application,
    user,
    transactions,
    swap,
    mint,
    burn,
    multicall,
    lists
  },
  middleware: [...getDefaultMiddleware({ thunk: true, serializableCheck: false }), save({ states: PERSISTED_KEYS })],
  preloadedState: loadedState
})

store.dispatch(updateVersion())

export default store

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

