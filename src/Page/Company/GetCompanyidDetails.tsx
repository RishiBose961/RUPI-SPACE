import CompanyByid from "@/components/Hook/Compnay/CompanyByid"
import { Button } from "@/components/ui/button";
import { useParams } from "react-router"
import RegisterAmount from "../Amount/RegisterAmount";

const GetCompanyidDetails = () => {
    const { id } = useParams();
    const { isPending, getCompanyid } = CompanyByid({ id: id || "" }) as {
        isPending: boolean,
        getCompanyid: {
            _id: string,
            companyname: string,
            name: string,
            paydate: string,
            payplan: boolean,
            createdAt: string,
            updatedAt: string
        }
    }



    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isPending) {
        return <div>Loading...</div>
    }
    return (
        <>
            <div className=" w-full  shadow-lg rounded-xl overflow-hidden border border-gray-200 font-sans">
                <div className=" px-6 py-4 ">
                    <h2 className="text-xl font-bold  uppercase tracking-wide">
                        {getCompanyid?.companyname}
                    </h2>
                    <p className="text-sm  mt-1">
                        {getCompanyid?.name}
                    </p>
                </div>

                {/* Body Section: Key Details */}
                <div className="px-6 py-4 space-y-4">

                    {/* Payment Plan Status */}
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium ">Payment Plan</span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full `}>
                            {getCompanyid?.payplan || "₹ 0"}
                        </span>
                    </div>

                    {/* Payment Date */}
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium ">Pay Date</span>
                        <span className="text-sm ">
                            {getCompanyid?.paydate ? formatDate(getCompanyid?.paydate) : <Button>Update</Button>}
                        </span>
                    </div>


                </div>

                {/* Footer Section: MetagetCompanyid? */}
                <div className=" px-6 py-3  text-xs flex flex-col gap-1">
                    <div className="flex justify-between">
                        <span>Created:</span>
                        <span>{formatDate(getCompanyid?.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Last Updated:</span>
                        <span>{formatDate(getCompanyid?.updatedAt)}</span>
                    </div>

                </div>

            </div>
            <RegisterAmount />
        </>
    )
}

export default GetCompanyidDetails