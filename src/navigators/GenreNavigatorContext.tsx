import { createContext } from 'react';

export const GenreTabNavigatorContext = createContext<{ id?: string; name?: string }>({});
