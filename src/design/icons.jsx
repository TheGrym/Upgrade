export const Ico = ({ d, s = 16, c = "currentColor" }) => (
  <svg
    width={s} height={s} viewBox="0 0 24 24"
    fill="none" stroke={c} strokeWidth="1"
    strokeLinecap="square" strokeLinejoin="miter"
    style={{ flexShrink: 0, display: "block" }}
  >
    <path d={d} />
  </svg>
);

export const IC = {
  nav_home:  "M3 11L12 4L21 11V20H14V14H10V20H3V11Z",
  nav_train: "M3 9H6V15H3ZM7 7H9V17H7ZM15 7H17V17H15ZM18 9H21V15H18ZM9 12H15",
  nav_stats: "M3 21H21M7 21V11M12 21V5M17 21V14",
  nav_more:  "M5 12H5.01M12 12H12.01M19 12H19.01",
  check:   "M4 12L9 17L20 6",
  close:   "M5 5L19 19M19 5L5 19",
  plus:    "M12 4V20M4 12H20",
  minus:   "M4 12H20",
  chevR:   "M9 6L15 12L9 18",
  chevD:   "M6 9L12 15L18 9",
  chevU:   "M6 15L12 9L18 15",
  arrowR:  "M4 12H20M14 6L20 12L14 18",
  play:    "M6 4V20L20 12Z",
  circle:  "M12 21A9 9 0 1 0 12 3A9 9 0 1 0 12 21Z",
  ring:    "M12 3V6M12 18V21M3 12H6M18 12H21M5.6 5.6L7.7 7.7M16.3 16.3L18.4 18.4M5.6 18.4L7.7 16.3M16.3 7.7L18.4 5.6",
  info:    "M12 21A9 9 0 1 0 12 3A9 9 0 1 0 12 21ZM12 8V8.01M11 12H12V16H13",
  note:    "M4 4H20V20L16 20L12 20L8 20L4 20V4Z",
  dl:      "M12 4V16M6 10L12 16L18 10M4 20H20",
  up:      "M12 20V4M6 10L12 4L18 10M4 20H20",
  trash:   "M4 7H20M9 7V4H15V7M10 11V17M14 11V17M6 7L7 21H17L18 7",
  edit:    "M4 20L4 16L16 4L20 8L8 20L4 20Z",
  trophy:  "M7 4H17V10A5 5 0 0 1 7 10V4ZM4 4H7V7A3 3 0 0 1 4 7V4ZM17 4H20V7A3 3 0 0 1 17 7V4ZM12 15V19M9 21H15",
};
