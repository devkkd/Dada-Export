'use client';

import { createContext, useContext } from 'react';

const B2BDataContext = createContext({
  categories:  [],
  allProducts: [],
  newArrivals: [],
  featured:    [],
});

export function B2BDataProvider({ children, data }) {
  return <B2BDataContext.Provider value={data}>{children}</B2BDataContext.Provider>;
}

export function useB2BData() {
  return useContext(B2BDataContext);
}
