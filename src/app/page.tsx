import Typography from "@/components/Typography";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center min-h-screen bg-neutral-50 dark:bg-black p-4 text-center">
      <Typography variant="h1" className="mb-4">
        Welcome to <span className="text-primary-500">next.in</span>
      </Typography>
      <Typography variant="subtitle1" color="muted">
        Your go-to thrift store for sustainable style, pre-loved fashion, and vintage finds.
      </Typography>
    </main>
  );
}

