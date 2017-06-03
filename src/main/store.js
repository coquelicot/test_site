import { createStore as _createStore } from 'redux';

export function createStore(preloadedState=undefined) {
  return _createStore(
    () => ({}),
    preloadedState,
  );
}
