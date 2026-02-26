const deny = () => {
  throw new Error('Storage is forbidden per FR-008.');
};

const wrapStorage = (storageName) => {
  const storage = window[storageName];
  if (!storage) {
    return;
  }

  const proxy = new Proxy(storage, {
    get(target, prop) {
      if (['setItem', 'removeItem', 'clear'].includes(prop)) {
        return deny;
      }
      return Reflect.get(target, prop, target);
    },
  });

  try {
    Object.defineProperty(window, storageName, {
      value: proxy,
      configurable: true,
    });
    return;
  } catch (error) {
    // Ignore and try fallback below.
  }

  try {
    window[storageName] = proxy;
    return;
  } catch (error) {
    // Ignore and fallback to method overrides.
  }

  try {
    storage.setItem = deny;
    storage.removeItem = deny;
    storage.clear = deny;
  } catch (error) {
    // Ignore environments where storage methods are read-only.
  }
};

export const preventPersistence = ({ dev = false } = {}) => {
  if (!dev) {
    return;
  }

  try {
    wrapStorage('localStorage');
    wrapStorage('sessionStorage');
  } catch (error) {
    // Ignore if storage is unavailable in this environment.
  }
};
