import { createContext } from 'react';
import { AlbumType } from '../services/jam';

export const AlbumsTabNavigatorContext = createContext<{ albumType?: AlbumType }>({});
