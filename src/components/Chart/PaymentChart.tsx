"use client"

import { useState } from "react"
import axios from "axios"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSelector } from "react-redux"
import CheckEnvironment from "@/CheckEnvironment/CheckEnvironment"
import { useParams } from "react-router"

const chartConfig = {
  totalAmount: {
    label: "Payments",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

const fetchPayments = async (companyId: string, year: string, base_url: string, token: string) => {
  const { data } = await axios.get(
    `${base_url}/api/payments/chart/${companyId}?year=${year}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
  return data
}

export function PaymentChart() {
    const {id} = useParams()
    const { user, isAuthenticated } = useSelector(
        (state: {
            auth: {
                isAuthenticated: boolean;
                user: { token: string; _id: string };
            };
        }) => state.auth
    );

    const { base_url } = CheckEnvironment();

  const currentYear = new Date().getFullYear().toString()

  const [year, setYear] = useState(currentYear)

  const { data, isLoading } = useQuery({
    queryKey: ["payment-chart", id, year],
    queryFn: () => fetchPayments(id || "", year, base_url, user?.token || ""),
    placeholderData: keepPreviousData,
    enabled: isAuthenticated && !!id,
  })

  // Transform backend → chart format
  const chartData =
    data?.data?.map((item: { monthName: string; totalAmount: number }) => ({
      month: item.monthName,
      totalAmount: item.totalAmount,
    })) || []

  return (
    <Card className="mb-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Yearly Payment Overview</CardTitle>
          <CardDescription>Monthly totals for {year}</CardDescription>
        </div>

        {/* Year Selector */}
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2025">2025</SelectItem>
            <SelectItem value="2026">2026</SelectItem>
            <SelectItem value="2027">2027</SelectItem>
            <SelectItem value="2028">2028</SelectItem>
            <SelectItem value="2029">2029</SelectItem>
            <SelectItem value="2030">2030</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading chart...</p>
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                dataKey="totalAmount"
                fill="var(--color-totalAmount)"
                radius={8}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
