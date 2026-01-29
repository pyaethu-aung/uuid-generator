# Quickstart: Sync Browser Colors

## Implementation Steps

1. **Verify Base State**: Run `npm run dev` to ensure a clean starting point.
2. **Create Hook**: Implement `useBrowserThemeSync` to handle the `<meta>` tag updates.
3. **Create Component**: Implement `ScrollProgressBackground` with high-performance CSS.
4. **Integrate into App**: Add the hook and component to `App.jsx`.
5. **Verify Performance**: Use Chrome DevTools (Rendering tab) to ensure no significant layout shifts or dropped frames during scroll.

## Test Cases

- **T1**: Verify address bar color changes when switching between light and dark mode.
- **T2**: Verify background color is 100% transparent at scroll < 80px.
- **T3**: Verify background color increases in intensity until 500px.
- **T4**: Verify return to transparent when scrolling back to top.
