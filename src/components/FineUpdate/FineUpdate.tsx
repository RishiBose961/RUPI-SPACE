import CheckEnvironment from "@/CheckEnvironment/CheckEnvironment"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { EditIcon } from "lucide-react"
import { useState } from "react"
import { useSelector } from "react-redux"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"

type FineUpdateProps = {
  id: string
}

const FineUpdate = ({ id }: FineUpdateProps) => {
  const { user } = useSelector(
    (state: {
      auth: {
        isAuthenticated: boolean
        user: { token: string; _id: string }
      }
    }) => state.auth
  )

  const { base_url } = CheckEnvironment()

  // ✅ store as string (IMPORTANT)
  const [fine, setFine] = useState("")
  const [open, setOpen] = useState(false)

  const queryClient = useQueryClient()

  const updateFineMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        fine: Number(fine),
      }

      const res = await axios.patch(
        `${base_url}/api/payments/updatefine/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      )

      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] })
      alert(`Fine updated successfully ${fine}`)
      setOpen(false)
      setFine("")
    },
    onError: (error) => {
      console.error("Update fine failed:", error)
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <EditIcon className="size-4 cursor-pointer text-muted-foreground hover:text-red-500 transition" />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Fine</DialogTitle>
          <DialogDescription>
            Update fine details here
          </DialogDescription>
        </DialogHeader>

        <div>
          <Label>Fine</Label>
          <Input
            type="number"
            placeholder="Enter the Fine"
            className="mt-2"
            value={fine}
            onChange={(e) => setFine(e.target.value)}
          />

          <Button
            className="mt-4"
            onClick={() => updateFineMutation.mutate()}
            disabled={
              updateFineMutation.isPending ||
              fine === "" ||
              Number(fine) <= -1
            }
          >
            {updateFineMutation.isPending ? "Updating..." : "Update"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default FineUpdate
