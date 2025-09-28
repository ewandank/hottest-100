import { createContext, useContext, type Component, type JSX } from "solid-js";
import { createStore } from "solid-js/store";

type storeState = {
  playlistId: string | undefined;
  iterator: number | undefined;
};
const [store, setStore] = createStore<storeState>({
  playlistId: undefined,
  iterator: undefined,
});

type StoreContextType = [storeState, typeof setStore];
export const GlobalState = createContext<StoreContextType>();

export const GlobalStateProvider: Component<{
  children: JSX.Element | undefined | null;
}> = (props) => (
  <GlobalState.Provider value={[store, setStore]}>
    {props.children}
  </GlobalState.Provider>
);

export const useGlobalContext = () => {
  const context = useContext(GlobalState);
  if (!context) {
    throw new Error("Can't find global context");
  }
  return context;
};
