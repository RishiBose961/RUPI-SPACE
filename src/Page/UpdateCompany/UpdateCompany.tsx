import { useState } from "react"
import axios from "axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSelector } from "react-redux"
import CheckEnvironment from "@/CheckEnvironment/CheckEnvironment"

interface UpdateCompanyProps {
  companyId: string | undefined
}

const UpdateCompany = ({
  companyId,
}: UpdateCompanyProps) => {
    const { user } = useSelector(
        (state: {
            auth: {
                user: { token: string; _id: string };
            };
        }) => state.auth
    );

    const { base_url } = CheckEnvironment();
  const queryClient = useQueryClient()

  const [open, setOpen] = useState(false)
  const [paydate, setPaydate] = useState("")
  const [payplan, setPayplan] = useState("")


  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await axios.patch(
        `${base_url}/api/companies/update/${companyId}`,
        { paydate, payplan },{
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      )
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] })
      alert("Company updated successfully")
      setOpen(false)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutate()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className=" cursor-pointer"  variant="link">Update</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Company</DialogTitle>
          <DialogDescription>
            Make changes to your company here.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="space-y-1">
            <Label>Payment Date</Label>
            <Input
              name="paydate"
              type="date"
              value={paydate}
              onChange={(e) => setPaydate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <Label>Payment Plan</Label>
            <Select value={payplan} onValueChange={setPayplan}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a payment plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="half-yearly">Half Yearly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? "Updating..." : "Submit"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateCompany
