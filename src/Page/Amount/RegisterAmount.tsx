import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { useState } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import CheckEnvironment from "@/CheckEnvironment/CheckEnvironment"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSelector } from "react-redux"


const formatIndianCurrency = (value: string) => {
  if (!value) return ""
  return "₹ " + Number(value).toLocaleString("en-IN")
}

const extractNumber = (value: string) =>
  Number(value.replace(/[^0-9]/g, ""))


const RegisterAmount = ({ id }: { id: string | undefined }) => {
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState("")

  const { user } = useSelector(
    (state: {
      auth: { user: { token: string } }
    }) => state.auth
  )
const queryClient = useQueryClient();
  const { base_url } = CheckEnvironment()

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: { payamount: number; takedate: string }) => {
      const res = await axios.post(
        `${base_url}/api/payments/create`,
        {
          ...data,
          companyBy: id,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
        }
      )
      return res.data
    },
    onSuccess: () => {
      setAmount("")
      setDate("")
        queryClient.invalidateQueries({ queryKey: ["payments"] });
      alert(`Payment of ${amount} is created successfully`)
    },
    onError: (error: { response: { data: { message: string } } }) => {
      alert(error?.response?.data?.message || "Something went wrong ❌")
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const numericAmount = extractNumber(amount)

    if (!numericAmount || !date) {
      alert("Please enter amount and date")
      return
    }

    mutate({
      payamount: numericAmount,
      takedate: date,
    })
  }

  return (
    <Card className="w-full mt-4">
      <CardHeader>
        <CardTitle>Payment</CardTitle>
        <CardDescription>Enter payment details below</CardDescription>
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
                required
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
                required
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
