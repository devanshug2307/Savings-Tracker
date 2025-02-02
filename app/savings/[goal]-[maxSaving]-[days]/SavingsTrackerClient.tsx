"use client";

import dynamic from "next/dynamic";

const SavingsTracker = dynamic(
  () => import("../../components/SavingsTracker"),
  {
    ssr: false,
  }
);

export default SavingsTracker;
