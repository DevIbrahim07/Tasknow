const Footer = () => {
  return (
    <footer className="border-t border-teal-900/10 bg-amber-50 py-10">
      <div className="mx-auto flex w-[min(1100px,92%)] flex-wrap items-center justify-between gap-6 text-sm text-slate-600">
        <div>
          <h4 className="mb-2 text-base font-semibold text-teal-700">
            tasknow
          </h4>
          <p>Plan with focus. Finish with calm.</p>
        </div>
        <div className="flex flex-col gap-1">
          <span>Built for mindful productivity</span>
          <span>2026</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
