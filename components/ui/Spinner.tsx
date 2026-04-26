export default function Spinner({
  size = "default",
  white = false
}: {
  size?: "sm" | "default";
  white?: boolean;
}) {
  const classes = [
    "spinner",
    size === "sm" ? "spinner-sm" : "",
    white ? "spinner-white" : ""
  ]
    .filter(Boolean)
    .join(" ");

  return <span className={classes} role="status" aria-label="Loading" />;
}
