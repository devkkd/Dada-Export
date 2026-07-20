'use client';

import { createContext, useContext } from 'react';

const RetailDataContext = createContext({
  categories:  [],
  allProducts: [],
  newArrivals: [],
  featured:    [],
});

export function RetailDataProvider({ children, data }) {
  return <RetailDataContext.Provider value={data}>{children}</RetailDataContext.Provider>;
}

export function useRetailData() {
  return useContext(RetailDataContext);
}
