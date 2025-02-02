import Link from "next/link";

const goals = [100, 500, 1000, 2000, 5000, 10000];
const maxSavings = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const daysOptions = [7, 30, 60, 90, 180, 365];

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-pink-600 text-center mb-8">
        Savings Challenges
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {goals.map((goal) =>
          maxSavings.map((maxSaving) =>
            daysOptions.map((days) => {
              // Only show mathematically possible combinations
              if (maxSaving * days >= goal) {
                return (
                  <Link
                    key={`${goal}-${maxSaving}-${days}`}
                    href={`/savings/${goal}-${maxSaving}-${days}`}
                    className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                  >
                    <h2 className="text-xl font-semibold text-pink-600 mb-2">
                      Save ${goal.toLocaleString()}
                    </h2>
                    <p className="text-gray-600">
                      Save ${maxSaving}/day for {days} days
                    </p>
                    <div className="mt-4 text-sm text-pink-500 font-medium">
                      Start Challenge →
                    </div>
                  </Link>
                );
              }
              return null;
            })
          )
        )}
      </div>
    </div>
  );
}
