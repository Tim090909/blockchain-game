import Web3Login from "@/components/Web3Login";


export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mt-4">Козацький бізнес</h1>
      <Web3Login />
    </div>
  );
}
