import React from 'react';
import { createRoot } from 'react-dom/client';

import Styles from './index.module.scss';

// Import Components
import { Logo } from './components/Logo';
import VideoList from './components/VideoList';
import { Provider } from 'react-redux';

// Import Global State Store
import store from './redux/store';
// Import packages to maintain state on reloads
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';

let persistor = persistStore(store);

// App
const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Logo className={Styles.logo} />
        <VideoList />
      </PersistGate>
    </Provider>
  );
};

// Create root and render
const domContainer = document.querySelector('#app');
const root = createRoot(domContainer);
root.render(<App />);
