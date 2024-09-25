import {combineReducers, configureStore, Middleware} from '@reduxjs/toolkit';
import {persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setupListeners} from '@reduxjs/toolkit/query/react';
import {
	user,
} from './reducers';

const persistConfig = {
	key: 'root',
	version: 1,
	storage: AsyncStorage,
};

const reducer = combineReducers({
	user,
});

const persistedReducer = persistReducer(persistConfig, reducer);

const middleware: Middleware[] = [];

const store = configureStore({
	reducer: persistedReducer,
	middleware: gDM =>
		gDM({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}).concat(middleware),
});

setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself

export default store;
