import { useDispatch as useReduxDispatch } from 'react-redux';
import { AppDispatch } from '../types';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useDispatch = () => useReduxDispatch<AppDispatch>();
