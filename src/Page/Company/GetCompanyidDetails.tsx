import CompanyByid from "@/components/Hook/Compnay/CompanyByid"
import { Button } from "@/components/ui/button";
import { useParams } from "react-router"
import RegisterAmount from "../Amount/RegisterAmount";
import ViewAmount from "../Amount/ViewAmount";

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
            <div className=" w-full bg-card shadow-lg rounded-xl overflow-hidden  font-sans">
                <div className=" px-6 py-4 ">
                    <h2 className="text-xl font-bold  uppercase tracking-wide">
                        {getCompanyid?.companyname}
                    </h2>
                    <p className="text-sm  mt-1">
                        {getCompanyid?.name}
                    </p>
                </div>
                <div className="px-6 py-4 space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium ">Payment Plan</span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full `}>
                            {getCompanyid?.payplan || "₹ 0"}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium ">Payment Date</span>
                        <span className="text-sm ">
                            {getCompanyid?.paydate ? formatDate(getCompanyid?.paydate) : <Button>Update</Button>}
                        </span>
                    </div>
                </div>
            </div>
            {
                getCompanyid?.payplan && <>
                    <RegisterAmount id={id} />
                    <ViewAmount id={id} />
                </>
            }

        </>
    )
}

export default GetCompanyidDetails