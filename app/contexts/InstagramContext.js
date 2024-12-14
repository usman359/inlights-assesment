"use client";

import { createContext, useContext, useState } from "react";

const InstagramContext = createContext();

function InstagramProvider({ children }) {
  const [posts, setPosts] = useState([]);
  return (
    <InstagramContext.Provider value={{ posts, setPosts }}>
      {children}
    </InstagramContext.Provider>
  );
}

function useInstagram() {
  const context = useContext(InstagramContext);
  if (!context) {
    throw new Error("useInstagram must be used within a InstagramProvider");
  }
  return context;
}

export { InstagramProvider, useInstagram };
