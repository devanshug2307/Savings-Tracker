"use client";

import { useState, useEffect } from "react";
import Script from "next/script";

interface Props {
  goal: number;
  maxSaving: number;
  totalDays: number;
}

export default function SavingsTracker({ goal, maxSaving, totalDays }: Props) {
  const [gridCells, setGridCells] = useState<string[]>([]);
  const [savedCells, setSavedCells] = useState<number[]>([]);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [isScriptsLoaded, setIsScriptsLoaded] = useState(false);

  useEffect(() => {
    generateGrid();
  }, [goal, maxSaving, totalDays]);

  const generateGrid = () => {
    if (maxSaving * totalDays < goal) {
      setMessage(
        `With a daily saving limit of $${maxSaving}, you cannot reach the goal of $${goal} in ${totalDays} days. Please adjust your parameters.`
      );
      return;
    }

    let remainingGoal = goal;
    let savings: number[] = [];
    let zeroDays = 0;

    for (let i = 0; i < totalDays - 1; i++) {
      let remainingDays = totalDays - i - 1;
      let maxPossible = Math.min(maxSaving, remainingGoal);
      let minRequired = Math.max(
        0,
        Math.ceil((remainingGoal - (remainingDays - 1) * maxSaving) / 1)
      );

      let value = Math.min(
        Math.floor(
          Math.random() * (maxPossible - minRequired + 1) + minRequired
        ),
        remainingGoal
      );

      value = Math.ceil(value / 5) * 5;

      if (value === 0) {
        zeroDays++;
      }

      savings.push(value);
      remainingGoal -= value;
    }

    let finalAmount = Math.min(Math.ceil(remainingGoal / 5) * 5, maxSaving);
    savings.push(finalAmount);
    if (finalAmount === 0) zeroDays++;

    savings = savings.filter((value) => value > 0);
    setGridCells(savings.map((value) => `$${value}`));

    const actualDays = totalDays - zeroDays;
    setMessage(
      zeroDays > 0
        ? `✦ Congrats! You wanted to save $${goal.toLocaleString()} in ${totalDays} days, but you'll achieve it in just ${actualDays} days! ✦`
        : `✦ Congrats! You will save $${goal.toLocaleString()} in ${totalDays} days! ✦`
    );
  };

  const toggleCell = (index: number) => {
    setSavedCells((prev) => {
      const newSavedCells = prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index];

      setProgress((newSavedCells.length / gridCells.length) * 100);
      return newSavedCells;
    });
  };

  const downloadPDF = async () => {
    if (typeof window === "undefined") return;

    try {
      const { jsPDF } = await import("jspdf");

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Add a soft pink background
      doc.setFillColor(255, 245, 247);
      doc.rect(0, 0, 210, 297, "F");

      // Add decorative header
      doc.setFillColor(255, 77, 141);
      doc.roundedRect(15, 15, 180, 35, 5, 5, "F");

      // Add title
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(24);
      doc.text("Savings Tracker", 105, 35, { align: "center" });

      // Add saving goal details
      doc.setTextColor(255, 77, 141);
      doc.setFontSize(16);
      doc.text("My Savings Challenge", 105, 65, { align: "center" });

      // Add goal details with decorative box
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(25, 70, 160, 30, 3, 3, "F");
      doc.setFontSize(14);
      doc.setTextColor(80, 80, 80);
      doc.text(`Goal: $${goal.toLocaleString()}`, 105, 82, { align: "center" });
      doc.text(`Time Period: ${totalDays} Days`, 105, 92, { align: "center" });

      // Add motivational message
      doc.setFontSize(12);
      doc.setTextColor(255, 77, 141);
      doc.text(
        "Track your progress by marking each box as you save!",
        105,
        110,
        { align: "center" }
      );

      // Create grid directly in PDF
      const startY = 120;
      const startX = 25;
      const cellWidth = 26;
      const cellHeight = 15;
      const cellsPerRow = 6;
      const cellSpacing = 2;
      const totalWidth =
        cellWidth * cellsPerRow + cellSpacing * (cellsPerRow - 1);

      gridCells.forEach((value, index) => {
        const row = Math.floor(index / cellsPerRow);
        const col = index % cellsPerRow;
        const x = startX + col * (cellWidth + cellSpacing);
        const y = startY + row * (cellHeight + cellSpacing);

        // Draw cell background
        if (savedCells.includes(index)) {
          doc.setFillColor(255, 77, 141);
        } else {
          doc.setFillColor(255, 255, 255);
        }
        doc.roundedRect(x, y, cellWidth, cellHeight, 2, 2, "F");

        // Draw cell border
        doc.setDrawColor(255, 77, 141);
        doc.roundedRect(x, y, cellWidth, cellHeight, 2, 2, "D");

        // Add cell text
        if (savedCells.includes(index)) {
          doc.setTextColor(255, 255, 255);
        } else {
          doc.setTextColor(80, 80, 80);
        }
        doc.setFontSize(10);
        doc.text(value, x + cellWidth / 2, y + cellHeight / 2, {
          align: "center",
          baseline: "middle",
        });
      });

      // Add progress tracking section
      const gridHeight =
        Math.ceil(gridCells.length / cellsPerRow) * (cellHeight + cellSpacing);
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(25, startY + gridHeight + 15, 160, 30, 3, 3, "F");
      doc.setFontSize(12);
      doc.setTextColor(80, 80, 80);
      doc.text("Progress Tracking", 105, startY + gridHeight + 30, {
        align: "center",
      });
      doc.text(
        "Start Date: _____________  Target End Date: _____________",
        105,
        startY + gridHeight + 40,
        { align: "center" }
      );

      // Add footer
      doc.setFontSize(10);
      doc.setTextColor(153, 153, 153);
      doc.text("* Generated with love by Savings Tracker *", 105, 277, {
        align: "center",
      });

      // Save the PDF
      doc.save("my-savings-plan.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
        onLoad={() => setIsScriptsLoaded(true)}
      />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"
        onLoad={() => setIsScriptsLoaded(true)}
      />

      <div className="savings-tracker-container">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-6">
          <div className="text-center mb-8">
            <h2
              className="text-3xl font-bold text-[#ff4d8d] uppercase tracking-wide relative inline-block pb-3
                          after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 
                          after:w-3/5 after:h-1 after:bg-gradient-to-r after:from-[#ffd1dc] after:via-[#ff4d8d] after:to-[#ffd1dc] 
                          after:rounded-full"
            >
              Save Your Goal Amount
            </h2>
          </div>

          <div className="progress-section my-6 max-w-2xl mx-auto p-4 bg-[rgba(255,209,220,0.1)] rounded-2xl">
            <div className="message text-[#ff4d8d] text-lg font-semibold p-4 bg-[rgba(255,209,220,0.2)] rounded-2xl leading-relaxed">
              {message}
            </div>
            <div className="w-[90%] max-w-[500px] h-3 bg-white rounded-full mx-auto my-4 overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-[#ff4d8d] to-[#ff3377] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 p-4">
            {gridCells.map((value, index) => (
              <button
                key={index}
                onClick={() => toggleCell(index)}
                className={`
                  p-3 rounded-xl border-2 border-[#ffd1dc] text-center transition-all duration-300
                  hover:bg-[#fff5f7] hover:-translate-y-0.5 hover:shadow-lg
                  ${
                    savedCells.includes(index)
                      ? "bg-[#ff4d8d] text-white border-[#ff4d8d]"
                      : "bg-white"
                  }
                `}
              >
                {value}
              </button>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <button
              onClick={generateGrid}
              className="px-6 py-2 bg-[#ff4d8d] text-white rounded-full hover:bg-[#ff3377] transition-colors shadow-md hover:-translate-y-0.5 hover:shadow-lg"
            >
              Regenerate Plan
            </button>
            <button
              onClick={downloadPDF}
              className="px-6 py-2 bg-[#ff4d8d] text-white rounded-full hover:bg-[#ff3377] transition-colors shadow-md hover:-translate-y-0.5 hover:shadow-lg"
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
