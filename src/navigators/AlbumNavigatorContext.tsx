import { createContext } from 'react';

export const AlbumTabNavigatorContext = createContext<{ id?: string; name?: string }>({});
