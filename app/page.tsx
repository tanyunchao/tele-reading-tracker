"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Book, Clock, BookOpen } from "lucide-react";
import { startOfToday, subDays, format } from "date-fns";

// This would typically come from your database
const generateLast7DaysData = () => {
  const today = startOfToday();
  return Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(today, 6 - i);
    return {
      date: format(date, "MM/dd"),
      pagesRead: Math.floor(Math.random() * 30) + 5, // Sample data
    };
  });
};

const ReadingDashboard = () => {
  const books = [
    {
      id: "1",
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      totalPages: 180,
      currentPage: 120,
      startDate: new Date("2024-11-25"),
    },
  ];

  const readingProgress = [
    { date: "11/25", pages: 20 },
    { date: "11/26", pages: 45 },
    { date: "11/27", pages: 68 },
    { date: "11/28", pages: 89 },
    { date: "11/29", pages: 105 },
    { date: "11/30", pages: 120 },
  ];

  const recentReadingData = generateLast7DaysData();

  const totalPagesReadToday =
    recentReadingData[recentReadingData.length - 1].pagesRead;

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Reading Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center space-x-2">
            <Book className="w-4 h-4" />
            <CardTitle className="text-sm font-medium">Active Books</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{books.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-x-2">
            <Clock className="w-4 h-4" />
            <CardTitle className="text-sm font-medium">Last Update</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Today</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-x-2">
            <BookOpen className="w-4 h-4" />
            <CardTitle className="text-sm font-medium">Pages Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPagesReadToday}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reading Activity Chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Recent Reading Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={recentReadingData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="pagesRead"
                  fill="#2563eb"
                  name="Pages Read"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Individual Book Cards */}
      {books.map((book) => (
        <Card key={book.id} className="mb-6">
          <CardHeader>
            <CardTitle>{book.title}</CardTitle>
            <p className="text-sm text-gray-500">{book.author}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">
                    Progress: {book.currentPage} of {book.totalPages} pages
                  </span>
                  <span className="text-sm font-medium">
                    {Math.round((book.currentPage / book.totalPages) * 100)}%
                  </span>
                </div>
                <Progress
                  value={(book.currentPage / book.totalPages) * 100}
                  className="h-2"
                />
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={readingProgress}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="pages"
                      stroke="#2563eb"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ReadingDashboard;
