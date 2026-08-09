import type React from 'react';

// Wrapper component: the stub renders its children so the subtree stays testable.
export const SwipeableItem = jest.fn((properties: { children?: React.ReactNode }): React.ReactNode => properties.children ?? null);
