import { useState } from "react";
import axios from "axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import CheckEnvironment from "@/CheckEnvironment/CheckEnvironment";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { Loader2 } from "lucide-react";

type Company = {
    _id: string;
    companyname: string;
    name: string;
    paydate: string;
    payplan: boolean;
};

type ApiResponse = {
    success: boolean;
    page: number;
    totalPages: number;
    totalResults: number;
    resultsPerPage: number;
    data: Company[];
    base_url: string
};

const fetchCompanies = async (
    page: number,
    search: string,
    token: string,
    base_url: string
): Promise<ApiResponse> => {
    const { data } = await axios.get(
        `${base_url}/api/companies/show`,
        {
            params: { page, search },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return data;
};

export default function GetAllCompany() {
    const { user } = useSelector(
        (state: {
            auth: {
                isAuthenticated: boolean;
                user: { token: string; _id: string };
            };
        }) => state.auth
    );

    const { base_url } = CheckEnvironment();

    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");

    const { data, isLoading, isError, isFetching } = useQuery({
        queryKey: ["companies", page, search],
        queryFn: () => fetchCompanies(page, search, user?.token || "", base_url),
        placeholderData: keepPreviousData
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        setSearch(searchInput);
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Companies</h1>

            {/* 🔍 Search */}
            <form onSubmit={handleSearch} className="flex items-center gap-2 mb-6">
                <input
                    type="text"
                    placeholder="Search by company or name..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="border px-3 py-2 rounded w-full"
                />
                <Button
                    type="submit"
                    className=" cursor-pointer px-3 py-2 rounded"
                >
                    Search
                </Button>
            </form>

            {isLoading && <p>Loading companies...</p>}

            {isFetching && !isLoading && (
  <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
    <Loader2 className="h-4 w-4 animate-spin" />
    Updating...
  </div>
)}


            {isError && <p className="text-red-500">Failed to load data</p>}

            {data && data.data.length === 0 && (
                <p className="text-gray-500">No companies found.</p>
            )}

            {data && data.data.length > 0 && (
                <div className="overflow-x-auto border rounded-lg">
                    <table className="w-full text-sm">
                        <thead className=" text-left">
                            <tr>
                                <th className="p-3">Company</th>
                                <th className="p-3">Person</th>
                                <th className="p-3">Pay Date</th>
                                <th className="p-3">Pay Plan</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.data.map((company) => (
                                <tr key={company._id} className="border-t">
                                    <td className="p-3 font-medium">{company.companyname}</td>
                                    <td className="p-3 capitalize">{company.name}</td>
                                    <td className="p-3">
                                        {company.paydate
                                            ? company.paydate
                                            : "-"}
                                    </td>
                                    <td className="p-3 capitalize">
                                        {company.payplan ? company.payplan : "-"}
                                    </td>
                                    <td className="p-3">
                                        <Link to={`/get-company/${company._id}`}>
                                            <Button variant="link" className="px-3 py-1 cursor-pointer rounded mr-2">
                                                View details
                                            </Button>
                                        </Link>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* 📄 Pagination */}
            {data && data.totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-6">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Prev
                    </button>

                    <span className="font-medium">
                        Page {data.page} of {data.totalPages}
                    </span>

                    <button
                        disabled={page === data.totalPages}
                        onClick={() => setPage((p) => p + 1)}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
