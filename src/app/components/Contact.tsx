function Contact({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`${className}`} {...props}>
      Contact Me
    </div>
  );
}

export default Contact;
