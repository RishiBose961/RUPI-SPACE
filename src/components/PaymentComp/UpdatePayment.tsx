import axios from "axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "../ui/button"
import { useSelector } from "react-redux"
import CheckEnvironment from "@/CheckEnvironment/CheckEnvironment"

type Props = {
  id: string | undefined,
  totalAmount: number
}

const updatePayment = async (
  id: string,
  base_url: string,
  token: string,
  totalAmount: number
) => {
  const res = await axios.put(
    `${base_url}/api/payments/update/${id}`,
    {
      payamount:totalAmount
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
  return res.data
}

const UpdatePayment = ({ id,totalAmount }: Props) => {
  const { user } = useSelector(
    (state: {
      auth: {
        isAuthenticated: boolean
        user: { token: string; _id: string }
      }
    }) => state.auth
  )

  const { base_url } = CheckEnvironment()
  const queryClient = useQueryClient()

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: () => updatePayment(id as string, base_url, user?.token || "",totalAmount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] })
    },
  })

  const handleClick = () => {
    if (!id) return
    mutate()
  }

  return (
    <div>
      <Button
        onClick={handleClick}
        className=" cursor-pointer"
        disabled={isPending || isSuccess || !id}
      >
        {isPending ? "Updating..." : isSuccess ? "Paid" : "Pay Now"}
      </Button>
    </div>
  )
}

export default UpdatePayment
