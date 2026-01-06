import type { Metadata } from "next";
import Home from "./home";

export const metadata: Metadata = {
  title: "Queen of Heaven School of Cavite, INC.",
};

export default function Page() {
  return <Home />;
}
