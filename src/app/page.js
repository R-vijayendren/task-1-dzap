"use client";
import Disperse from "@/components/DisperseComponent";
import Head from "next/head";

export default function Home() {
  const onSubmit = (values) => {
    console.log(values);
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-center py-5">
      <div className="w-[60%] bg-gray-800 p-10 text-slate-400 text-sm">
        <Disperse onSubmit={onSubmit} />
      </div>
    </main>
  );
}
