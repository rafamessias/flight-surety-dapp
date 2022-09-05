export default function Container({ children, className }) {
  return (
    <div className={`bg-white rounded shadow ${className}`}>{children}</div>
  );
}
