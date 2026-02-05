import { keepPreviousData, useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useState } from "react"

import CheckEnvironment from "@/CheckEnvironment/CheckEnvironment"
import { PaymentChart } from "@/components/Chart/PaymentChart"
import UpdatePayment from "@/components/PaymentComp/UpdatePayment"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { EditIcon } from "lucide-react"
import { useSelector } from "react-redux"
import { useParams } from "react-router"



const fetchPayments = async (
  page: number,
  takedate: string,
  base_url: string,
  token: string,
  id: string,
) => {
  const res = await axios.get(
    `${base_url}/api/payments/due/${id}`,
    {
      params: {
        page,
        limit: 5,
        takedate: takedate || undefined,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
  return res.data
}


const ViewById = () => {
  const [page, setPage] = useState(1)
  const [searchDate, setSearchDate] = useState("")
  const [appliedDate, setAppliedDate] = useState("")
  const { id } = useParams()

  const { user, isAuthenticated } = useSelector(
    (state: {
      auth: {
        isAuthenticated: boolean;
        user: { token: string; _id: string };
      };
    }) => state.auth
  );

  const { base_url } = CheckEnvironment();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["payments", page, appliedDate, id],
    queryFn: () => fetchPayments(page, appliedDate, base_url, user?.token || "", id || ""),
    placeholderData: keepPreviousData,
    enabled: isAuthenticated && !!id,
    staleTime: 60 * 1000,
  })

  const payments = data?.data || []

  

  return (
    <div className="grid lg:grid-cols-3 gap-4">

      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Company Payments</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          {/* 🔍 Search by Date */}
          <div className="flex gap-4 items-end">
            <div className="space-y-1">
              <Label>Search by Date</Label>
              <Input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
              />
            </div>
            <Button
              onClick={() => {
                setPage(1)
                setAppliedDate(searchDate)
              }}
            >
              Search
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setSearchDate("")
                setAppliedDate("")
                setPage(1)
              }}
            >
              Reset
            </Button>
          </div>


          {isLoading && <p>Loading payments...</p>}
          {isError && <p className="text-red-500">Failed to load payments</p>}

          {!isLoading && payments.length === 0 && (
            <p>No payments found</p>
          )}




          <div className="space-y-3">
            <Table>
              <TableCaption>A list of your recent payments.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Date</TableHead>
                   <TableHead>Late Days</TableHead>
                  <TableHead>Fine Amount</TableHead>
                  <TableHead>Cal. Fine</TableHead>
                  <TableHead>T Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((p: {
                  _id: string
                  payamount: number
                  takedate: string
                  createdAt: string
                  fine?: number
                  calculatedFine: number
                  totalAmount: number
                  paid: boolean
                  lateDays: number
                }) => (
                  <TableRow key={p._id} className="hover:bg-muted/40 transition-colors">
                    <TableCell className="font-medium text-center">
                      ₹ {p.payamount.toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell className="text-center">
                      {new Date(p.takedate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-center">
                      {p.lateDays}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span>₹ {(p.fine || 50).toLocaleString("en-IN")}</span>
                        <EditIcon className="size-4 cursor-pointer text-muted-foreground hover:text-red-500 transition" />
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-orange-600 font-medium">
                      ₹ {p.calculatedFine.toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell className="text-center font-semibold text-green-600">
                      ₹ {p.totalAmount.toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell className="text-center">
                      {p.paid ? (
                        <Badge className="bg-green-600 hover:bg-green-700">Paid</Badge>
                      ) : (
                        <Badge variant="secondary">Pending</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {!p.paid && <UpdatePayment id={p._id} totalAmount={p.totalAmount}/>}
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>

          </div>

          {data && (
            <div className="flex justify-between items-center pt-4">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
              >
                Previous
              </Button>

              <span>
                Page {data.page} of {data.totalPages}
              </span>

              <Button
                variant="outline"
                disabled={page === data.totalPages}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      <div>
        <PaymentChart />
      </div>

    </div>
  )
}

export default ViewById
