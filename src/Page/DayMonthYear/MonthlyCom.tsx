import { useState } from "react";
import axios from "axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import CheckEnvironment from "@/CheckEnvironment/CheckEnvironment";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import { HandCoinsIcon, List, Search } from "lucide-react";
import { Link } from "react-router";
import MotivationalLoader from "@/components/Loading/MotivationalLoader";


type Company = {
    _id: string;
    companyname: string;
    payplan: string;
    paydate: string;
};

type ApiResponse = {
    success: boolean;
    page: number;
    totalPages: number;
    totalResults: number;
    resultsPerPage: number;
    data: Company[];
};

type User = {
    token: string;
    _id: string;
};

const fetchCompanies = async (
    page: number,
    search: string,
    user: User,
    base_url: string
) => {
    const { data } = await axios.get<ApiResponse>(
        `${base_url}/api/companies/monthly`,
        {
            params: { page, search },
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        }
    );

    return data;
};

export default function MonthlyCom() {
    const { user, isAuthenticated } = useSelector(
        (state: {
            auth: {
                isAuthenticated: boolean;
                user: User;
            };
        }) => state.auth
    );

    const { base_url } = CheckEnvironment();

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [input, setInput] = useState("");

    const { data, isLoading, isError, isFetching } = useQuery({
        queryKey: ["companies-month", page, search, user?._id, base_url],
        queryFn: () => fetchCompanies(page, search, user, base_url),
        enabled: isAuthenticated && !!user?.token,
        placeholderData: keepPreviousData,
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        setSearch(input);
    };
    
    if (isLoading) {
        return <MotivationalLoader/>
    }
    return (
        <div className="p-6 max-w-5xl mx-auto bg-card rounded-xl">
            <h1 className="text-2xl font-bold mb-4">Monthly Plan Companies</h1>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex items-center gap-2 mb-4">
                <input
                    type="text"
                    placeholder="Search company name..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="border px-3 py-2 rounded w-full"
                />
                <Button className=" cursor-pointer rounded-full">
                    <Search/>
                </Button>
            </form>

         
            {isError && <p className="text-red-500">Failed to load data</p>}

            {data && (
                <>
                    <Table>
                        <TableCaption>A list of your recent half year plan companies.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Company Name</TableHead>
                                <TableHead>Plan</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.data.map((company) => (
                                <TableRow key={company._id}>
                                    <TableCell className="font-medium">{company.companyname}</TableCell>
                                    <TableCell className=" capitalize">{company.payplan}</TableCell>
                                    <TableCell>  {new Date(company.paydate).toLocaleDateString()}</TableCell>
                                     <TableCell className="flex gap-2">
                                        <Link to={`/get-company/${company._id}`}>
                                            <Button className=" cursor-pointer rounded-full">
                                               <HandCoinsIcon/>
                                            </Button>
                                        </Link>
                                        <Link to={`/get-payment/${company._id}`}>
                                            <Button className=" cursor-pointer rounded-full">
                                                <List/>
                                            </Button>
                                        </Link>
                                     </TableCell>
                                </TableRow>

                            ))}
                            {data.data.length === 0 && (
                                <TableRow>
                                    <TableCell className="font-medium">No companies found</TableCell>
                                </TableRow>

                            )}
                         
                        </TableBody>
                    </Table>
                  

                    {/* Pagination */}
                    <div className="flex justify-between items-center mt-4">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage((p) => p - 1)}
                            className="px-4 py-2 border rounded disabled:opacity-50"
                        >
                            Previous
                        </button>

                        <span>
                            Page <strong>{data.page}</strong> of{" "}
                            <strong>{data.totalPages}</strong>
                        </span>

                        <button
                            disabled={page === data.totalPages}
                            onClick={() => setPage((p) => p + 1)}
                            className="px-4 py-2 border rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>

                    {isFetching && <p className="mt-2 text-sm">Updating...</p>}
                </>
            )}
        </div>
    );
}
