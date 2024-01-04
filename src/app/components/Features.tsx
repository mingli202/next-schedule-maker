function Features({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`${className}`} {...props}>
      Features Listing
    </div>
  );
}

export default Features;
