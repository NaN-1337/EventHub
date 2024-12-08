"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseConfig"; // Firestore config
import { collection, getDocs } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export function EventStatistic() {
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsRef = collection(db, "events");
        const querySnapshot = await getDocs(eventsRef);

        const counts: Record<string, number> = {};
        querySnapshot.docs.forEach((doc) => {
          const category = doc.data().category || "Other";
          counts[category] = (counts[category] || 0) + 1;
        });

        setCategoryCounts(counts);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  // Prepare data for the bar chart
  const chartData = Object.entries(categoryCounts).map(([category, count]) => ({
    category,
    count,
  }));

  // Define an array of custom colors for the bars
  const colors = ["#11999E", "#30E3CA", "#40514E", "#E4F9F5", "#F76C6C", "#FFD460"];

  return (
    <Card className="rounded-2xl shadow-lg bg-white mt-6">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-[#40514E]">Event Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" stroke="#40514E" />
              <YAxis allowDecimals={false} stroke="#40514E" />
              <Tooltip />
              <Bar dataKey="count">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
