export default function LoadingSpinner() {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '40vh' }}>
      <div className="spinner-border" role="status" style={{ color: 'var(--iris)' }}>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}