import { store } from '../state/store';

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;
