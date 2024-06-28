export default function HomePage() {
  return (
    <main className="container h-screen py-16">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Nice AI
        </h1>
        {process.env.NEXT_PUBLIC_API_PREFIX ?? ''}
      </div>
    </main>
  );
}
