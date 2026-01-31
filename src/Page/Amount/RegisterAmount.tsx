import { useState } from "react"
import axios from "axios"
import { useMutation } from "@tanstack/react-query"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Button } from "@/components/ui/button"


/* ---------- helpers ---------- */
const formatIndianCurrency = (value: string) => {
  if (!value) return ""
  const numbers = value.replace(/,/g, "")
  return "₹ " + Number(numbers).toLocaleString("en-IN")
}

const extractNumber = (value: string) =>
  Number(value.replace(/[^0-9]/g, ""))

/* ---------- component ---------- */
const RegisterAmount = () => {
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState("")

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: { amount: number; date: string }) => {
      const res = await axios.post(
        "http://localhost:5000/api/payment/create",
        payload
      )
      return res.data
    },
    onSuccess: () => {
      setAmount("")
      setDate("")
      alert("Payment created successfully ✅")
    },
    onError: (error: { response: { data: { message: string } } }) => {
      alert(error?.response?.data?.message || "Something went wrong ❌")
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    mutate({
      amount: extractNumber(amount),
      date,
    })
  }

  return (
    <Card className="w-full mt-4">
      <CardHeader>
        <CardTitle>Payment</CardTitle>
        <CardDescription>Enter payment details</CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Amount */}
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input
                className="font-semibold"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, "")
                  setAmount(formatIndianCurrency(raw))
                }}
              />
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                className="font-semibold"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            disabled={isPending}
            className="mt-4 rounded-4xl"
          >
            {isPending ? "Submitting..." : "Submit Payment"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export default RegisterAmount
