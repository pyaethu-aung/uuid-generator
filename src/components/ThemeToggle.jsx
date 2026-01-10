import { forwardRef } from "react";

const ThemeToggle = forwardRef(function ThemeToggle({ theme, onToggle }, ref) {
  const isDark = theme === "dark";
  const label = `Switch to ${isDark ? "light" : "dark"} mode`;

  return (
    <button
      type="button"
      onClick={onToggle}
      className="theme-toggle inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition"
      aria-label={label}
      ref={ref}
    >
      {isDark ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10 2a1 1 0 0 1 .94.658 8 8 0 1 0 10.402 10.402 1 1 0 0 1 1.284 1.284A10 10 0 1 1 10 2Z"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4v1m0 14v1m8-9h-1M5 11H4m14.95 6.95-.7-.7M6.75 6.75l-.7-.7m12.2 0-.7.7M6.05 17.95l-.7.7M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z"
          />
        </svg>
      )}
      <span>{isDark ? "Dark" : "Light"} mode</span>
    </button>
  );
});

export default ThemeToggle;
