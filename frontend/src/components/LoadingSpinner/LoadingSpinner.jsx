function LoadingSpinner() {
  return (
    <div className="mt-6 flex min-h-[200px] items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

export default LoadingSpinner;
