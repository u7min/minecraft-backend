import { createContext } from 'react';

export interface IRootContext {
}

export const RootContext = createContext<IRootContext | undefined>(undefined);
