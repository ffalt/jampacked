const actual = jest.requireActual<typeof import('../../src/components/ObjectHeader.tsx')>('../../src/components/ObjectHeader.tsx');

export const objectHeaderStyles = actual.objectHeaderStyles;
export const ObjectHeader = jest.fn(() => null);
