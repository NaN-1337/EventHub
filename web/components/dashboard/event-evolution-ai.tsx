"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseConfig"; // Firestore config
import { collection, getDocs } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Simple Linear Regression Function
const linearRegression = (data: number[]) => {
  const n = data.length;
  const x = Array.from({ length: n }, (_, i) => i + 1);
  const meanX = x.reduce((a, b) => a + b, 0) / n;
  const meanY = data.reduce((a, b) => a + b, 0) / n;

  const numerator = x.reduce((sum, xi, i) => sum + (xi - meanX) * (data[i] - meanY), 0);
  const denominator = x.reduce((sum, xi) => sum + Math.pow(xi - meanX, 2), 0);

  const slope = numerator / denominator;
  const intercept = meanY - slope * meanX;

  return { slope, intercept };
};

export function EventMonthlyEvolutionAI() {
  const [monthlyEventCounts, setMonthlyEventCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsRef = collection(db, "events");
        const querySnapshot = await getDocs(eventsRef);

        const counts: Record<string, number> = {};
        querySnapshot.docs.forEach((doc) => {
          const date = doc.data().date;
          if (date) {
            const month = new Date(date).toLocaleString("default", { month: "long" });
            counts[month] = (counts[month] || 0) + 1;
          }
        });

        setMonthlyEventCounts(counts);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const monthOrder = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const historicalData = monthOrder.map((month) => monthlyEventCounts[month] || 0);
  const { slope, intercept } = linearRegression(historicalData);

  const extendedMonths = [...monthOrder, "Next 1", "Next 2", "Next 3"];
  const extendedData = historicalData.slice();

  for (let i = 1; i <= 3; i++) {
    const predictedCount = Math.max(0, Math.round(slope * (historicalData.length + i) + intercept));
    extendedData.push(predictedCount);
  }

  const chartData = extendedMonths.map((month, i) => ({
    month,
    count: extendedData[i] || 0,
  }));

  return (
    <Card className="rounded-2xl shadow-lg bg-white mt-6">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-[#40514E]">
          Monthly Event Evolution with Prediction
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="#40514E" />
              <YAxis allowDecimals={false} stroke="#40514E" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#30E3CA"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
