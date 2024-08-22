"use client";
import { User } from "@prisma/client";
import { createContext } from "react";

interface Theme {
  mode: boolean
  setMode: (mode: boolean) => void
}

export const ThemeContext = createContext<Theme>({ mode: false, setMode: () => {} });

export const UserContext = createContext<User | null>(null);