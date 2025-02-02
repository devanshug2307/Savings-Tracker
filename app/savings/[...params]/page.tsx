import { Metadata } from "next";
import { notFound } from "next/navigation";
import SavingsTracker from "../../components/SavingsTracker";

interface Props {
  params: {
    params: string[];
  };
}

// Define valid combinations
const validGoals = [100, 500, 1000, 2000, 5000, 10000];
const validMaxSavings = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const validDays = [7, 30, 60, 90, 180, 365];

export const dynamicParams = true;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!params.params || !params.params[0]) return notFound();

  const [goal, maxSaving, days] = params.params[0].split("-").map(Number);

  if (isNaN(goal) || isNaN(maxSaving) || isNaN(days)) {
    return {
      title: "Invalid Savings Challenge",
      description: "This savings challenge page is not valid.",
    };
  }

  return {
    title: `Save $${goal.toLocaleString()} in ${days} Days Challenge - Savings Tracker`,
    description: `Join our savings challenge to save $${goal.toLocaleString()} in ${days} days by saving up to $${maxSaving} per day. Track your progress and achieve your financial goals!`,
    keywords:
      "savings challenge, money saving, financial goals, savings tracker, personal finance",
  };
}

export default function SavingsChallengePage({ params }: Props) {
  if (!params.params || !params.params[0]) return notFound();

  const [goal, maxSaving, days] = params.params[0].split("-").map(Number);

  // Validate parameters
  if (
    isNaN(goal) ||
    isNaN(maxSaving) ||
    isNaN(days) ||
    maxSaving * days < goal // Check if the goal is achievable
  ) {
    notFound();
  }

  return <SavingsTracker goal={goal} maxSaving={maxSaving} totalDays={days} />;
}
