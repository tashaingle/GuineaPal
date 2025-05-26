import { registerRootComponent } from 'expo';
import * as AppModule from './App';

const App = AppModule.default;

// Make sure App is actually being imported
if (!App) {
  console.error('App import is undefined');
}

registerRootComponent(App);
