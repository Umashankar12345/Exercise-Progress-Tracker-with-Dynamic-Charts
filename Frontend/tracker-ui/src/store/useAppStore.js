// useAppStore.js re-exports the single shared useStore instance
// This ensures FocusModeHUD and all other components share the same Zustand state
import useStore from './useStore';

export const useAppStore = useStore;

export default useStore;
