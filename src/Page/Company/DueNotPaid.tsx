import CheckEnvironment from "@/CheckEnvironment/CheckEnvironment";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router";

/* ------------------ types ------------------ */

type DelayedCompany = {
  _id: string;
  companyname: string;
  payplan: string;
  paydate: string;
  status: "DELAYED";
};

type ApiResponse = {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: DelayedCompany[];
};

/* ------------------ fetch function ------------------ */
const { base_url } = CheckEnvironment();
const fetchDelayedCompanies = async (
  page: number,
  limit: number,
  month: number,
  year: number,
  user: string
): Promise<ApiResponse> => {
  const res = await axios.get(
    `${base_url}/api/companies/delayed`,
    {
      params: { page, limit, month, year },
      headers: {
        Authorization: `Bearer ${user}`,
      }
    }
  );

  return res.data;
};


export default function DelayedCompanies() {
  const { user, isAuthenticated } = useSelector(
    (state: {
      auth: {
        isAuthenticated: boolean;
        user: { token: string; _id: string };
      };
    }) => state.auth
  );


  const currentYear = new Date().getFullYear();

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year] = useState<number>(currentYear);

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["delayed-companies", page, limit, month, year],
    queryFn: () => fetchDelayedCompanies(page, limit, month, year, user?.token || ""),
    placeholderData: keepPreviousData,
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
  });

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  return (
    <div>
      <div className="mt-3 mb-2">
        <Badge variant="outline" className=" mb-3">Select Month: </Badge>
        <Select
          value={month?.toString()}
          onValueChange={(value) => {
            setPage(1)
            setMonth(Number(value))
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>

          <SelectContent>
            {months.map((name, index) => (
              <SelectItem key={index} value={(index + 1).toString()}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading && <Button variant="outline" disabled size="sm">
        <Spinner data-icon="inline-start" />
        Loading ...
      </Button>
      }
      {isFetching && <span> Updating...</span>}
      {error && <p>Failed to load data</p>}

      <div className="space-y-2">
        {data?.data.map((company) => (
          <div
            key={company._id}
            className="flex items-center justify-between rounded-lg border p-3"
          >
            <div>
              <Link to={`/get-company/${company._id}`}>
                <p className="font-medium">{company.companyname}</p>
              <p className="text-xs text-muted-foreground">
                Pay Date: {company.paydate}
              </p>
              <Badge variant="secondary" className="mt-3">Status : {company.status}</Badge>
              </Link>
            
            </div>

            <span className="text-sm font-mono">
              {company.payplan}
            </span>
            
          </div>
          
        ))}
      </div>



    
{data && (
  <div className="mt-4 flex items-center justify-center gap-3">
    <Button
      variant="outline"
      size="sm"
      disabled={page === 1}
      onClick={() => setPage((p) => p - 1)}
    >
      Prev
    </Button>

    <span className="text-sm text-muted-foreground">
      Page <span className="font-medium text-foreground">{page}</span> of{" "}
      <span className="font-medium text-foreground">
        {data.totalPages}
      </span>
    </span>

    <Button
      variant="outline"
      size="sm"
      disabled={page === data.totalPages}
      onClick={() => setPage((p) => p + 1)}
    >
      Next
    </Button>
  </div>
)}
    </div>
  );
}
