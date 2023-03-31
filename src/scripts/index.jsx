import React from 'react';
import { createRoot } from 'react-dom/client';

import Styles from './index.module.scss';

// Import Components
import { Logo } from './components/Logo';
import VideoList from './components/VideoList';
import { Provider } from 'react-redux';

// Import Global State Store
import store from './redux/store';

// App
const App = () => {
  return (
    <Provider store={store}>
      <Logo className={Styles.logo} />
      <VideoList />
    </Provider>
  );
};

// Create root and render
const domContainer = document.querySelector('#app');
const root = createRoot(domContainer);
root.render(<App />);
