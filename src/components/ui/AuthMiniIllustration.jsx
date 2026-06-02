const AuthMiniIllustration = ({ items }) => {
  return (
    <div className="relative w-full max-w-md">
      <div className="absolute left-0 top-8 h-64 w-48 rounded-[34px] bg-[#13856f]" />
      <div className="absolute left-9 top-5 h-64 w-52 rounded-[34px] bg-[#fff4eb]" />

      <div className="relative ml-4 mt-4 rounded-[30px] bg-[#fff8f3] p-6 shadow-[0_20px_50px_rgba(38,21,8,0.12)]">
        <div className="mb-6 rounded-[24px] border border-[#efd9cb] bg-[linear-gradient(135deg,_#c8f2d8_0%,_#fdf6ef_100%)] p-4">
          <div className="relative mx-auto h-28 w-full max-w-[240px] overflow-hidden rounded-[20px]">
            <div className="absolute bottom-3 left-4 right-4 h-1 rounded-full bg-[#7c7f93]/30" />
            <div className="absolute left-1/2 top-7 h-11 w-11 -translate-x-1/2 rounded-full bg-[#8c5a5c]" />
            <div className="absolute left-1/2 top-[4.2rem] h-10 w-16 -translate-x-1/2 rounded-t-[22px] rounded-b-[14px] bg-[#f4ce59]" />
            <div className="absolute left-[4.45rem] top-[4.55rem] h-8 w-3 -rotate-45 rounded-full bg-[#f4ce59]" />
            <div className="absolute left-[3.85rem] top-[3.7rem] h-7 w-3 -rotate-[72deg] rounded-full bg-[#f4ce59]" />
            <div className="absolute right-[4.25rem] top-[4.35rem] h-8 w-3 rotate-45 rounded-full bg-[#f4ce59]" />
            <div className="absolute right-[3.7rem] top-[3.45rem] h-7 w-3 rotate-[72deg] rounded-full bg-[#f4ce59]" />

            <div className="absolute right-4 top-6 h-9 w-7 rounded-md border-2 border-[#f1c38c] bg-white shadow-sm" />
            <div className="absolute right-[1.1rem] top-[1.95rem] h-1 w-3 rounded-full bg-[#f1c38c]" />
            <div className="absolute right-[1.2rem] top-[2.45rem] h-1 w-4 rounded-full bg-[#d8dde8]" />

            <div className="absolute left-4 top-8 h-7 w-7 -rotate-12 rounded-md border-2 border-[#f1c38c] bg-white shadow-sm" />
            <div className="absolute left-5 top-[2.35rem] h-1 w-3 rounded-full bg-[#f1c38c]" />

            <div className="absolute left-8 top-4 h-7 w-7 rounded-md border border-[#d9d4f3] bg-white shadow-sm" />
            <div className="absolute left-[2.05rem] top-[1.05rem] h-2 w-2 rounded-sm bg-[#8a79d6]" />
            <div className="absolute left-[2.35rem] top-[0.75rem] h-1 w-1 rounded-full bg-[#8a79d6]" />
            <div className="absolute left-[2.45rem] top-[1.35rem] h-1 w-1 rounded-full bg-[#8a79d6]" />
            <div className="absolute left-[1.75rem] top-[1.35rem] h-1 w-1 rounded-full bg-[#8a79d6]" />

            <div className="absolute right-11 top-3 h-7 w-7 rounded-full border border-[#f4d3d1] bg-white shadow-sm" />
            <div className="absolute right-[2.9rem] top-[1rem] h-2.5 w-2.5 rounded-full bg-[#d07b75]" />
            <div className="absolute right-[2.55rem] top-[1.35rem] h-2.5 w-2.5 rounded-full bg-[#d07b75]" />
            <div className="absolute right-[2.72rem] top-[1.7rem] h-2.5 w-2.5 rotate-45 bg-[#d07b75]" />

            <div className="absolute left-6 top-14 h-6 w-6 rounded-full border border-[#cfead8] bg-white shadow-sm" />
            <div className="absolute left-[1.72rem] top-[3.8rem] h-1.5 w-3 rotate-[-45deg] rounded-full bg-[#13856f]" />
            <div className="absolute left-[1.95rem] top-[3.65rem] h-3.5 w-1.5 rotate-45 rounded-full bg-[#13856f]" />
          </div>
        </div>

        <div className="grid gap-3">
          {items.map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-2xl border border-[#f4ddd0] bg-white px-4 py-2.5">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-[#e8f6f2]">
                <div className="h-1.5 w-3 rotate-[-45deg] rounded-full bg-[#13856f]" />
                <div className="absolute h-3.5 w-1.5 rotate-45 rounded-full bg-[#13856f]" />
              </div>
              <p className="text-[13px] font-medium text-slate-700">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthMiniIllustration;
