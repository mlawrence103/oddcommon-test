import { configureStore } from '@reduxjs/toolkit';
import videoReducer from './reducer';

export default configureStore({ reducer: videoReducer });
