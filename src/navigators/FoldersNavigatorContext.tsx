import {createContext} from 'react';
import {AlbumType} from '../services/jam';

export const FoldersTabNavigatorContext = createContext<{ albumType?: AlbumType }>({});
