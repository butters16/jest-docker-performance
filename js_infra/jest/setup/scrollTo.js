// Mocks `window.scrollTo` with a no-op since some animations rely on it.
Object.defineProperty(window, "scrollTo", { value: () => {}, writable: true });
