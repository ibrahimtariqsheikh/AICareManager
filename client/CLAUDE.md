# Linting Issues Fixed

This document tracks the progress in fixing linting issues in the project.

## Fixed Issues

1. **Unescaped entities in quotes**: Replaced with `&quot;`, `&apos;`, etc.
2. **Unused imports**: Removed numerous unused imports across components
3. **Empty interfaces**: Replaced with better patterns
4. **Missing useEffect dependencies**: Added missing dependencies
5. **React component optimization**: Added useMemo to avoid recreating arrays on each render
6. **Any types**: Replaced many `any` types with more specific types
7. **Redundant props**: Removed unneeded props
8. **Unused assignments**: Fixed variables that were declared but never used
9. **Unused variables**: Fixed variables defined but never used

## Remaining Issues

There are still several linting issues remaining in the codebase:

1. **Unused imports**: Many components still import items they don't use
2. **Any types**: Some components still use `any` types that should be replaced
3. **Unescaped entities**: Still some unescaped quotes and apostrophes
4. **useEffect dependencies**: Some useEffect hooks still missing dependencies
5. **Image elements**: Some img elements should use Next.js Image component
6. **Props usage**: Some component props defined but not used

These remaining issues are mostly in files that aren't critical to the application's functionality.

## How to Lint

Run the following command to check for linting issues:

```bash
npm run lint
```