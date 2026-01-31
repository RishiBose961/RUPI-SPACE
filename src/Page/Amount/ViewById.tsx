import { useState } from "react"
import axios from "axios"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useSelector } from "react-redux"
import CheckEnvironment from "@/CheckEnvironment/CheckEnvironment"
import { useParams } from "react-router"

/* ---------- API ---------- */
const fetchPayments = async (
  page: number,
  takedate: string,
  base_url: string,
  token: string,
  id: string
) => {
  const res = await axios.get(
    `${base_url}/api/payments/${id}`,
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
  const {id} =useParams()

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
    queryKey: ["payments", page, appliedDate,id],
    queryFn: () => fetchPayments(page, appliedDate,base_url, user?.token || "",id || ""),
    placeholderData: keepPreviousData,
    enabled: isAuthenticated && !!id
  })

  const payments = data?.data || []

  return (
    <div className="p-6 space-y-6">
      <Card>
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
            {payments.map((p: { _id: string; payamount: number; takedate: string; createdAt: string }) => (
              <div
                key={p._id}
                className="flex justify-between items-center border p-3 rounded-xl"
              >
                <div>
                  <p className="font-semibold">₹ {p.payamount.toLocaleString("en-IN")}</p>
                  <p className="text-sm text-muted-foreground">
                    Date: {p.takedate}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(p.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>

          {/* 📄 Pagination */}
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
    </div>
  )
}

export default ViewById
