import PageIndicator from "./PageIndicator";

const PageShell = ({ children, className = "" }) => {
  return (
    <section className="mx-4 mt-4 rounded-2xl bg-(--bar) p-2">
      <div className={`relative min-h-136 overflow-hidden rounded-xl bg-neutral-50 lg:min-h-152 ${className}`}>
        {children}
        <PageIndicator />
      </div>
    </section>
  );
};

export default PageShell;
