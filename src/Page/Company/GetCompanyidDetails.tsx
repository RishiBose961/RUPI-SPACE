import CompanyByid from "@/components/Hook/Compnay/CompanyByid";
import { useParams } from "react-router";
import RegisterAmount from "../Amount/RegisterAmount";
import ViewAmount from "../Amount/ViewAmount";
import UpdateCompany from "../UpdateCompany/UpdateCompany";

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
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
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
                        <span className={`px-2 py-1 text-xs capitalize font-semibold rounded-full `}>
                            {getCompanyid?.payplan || "N/A"}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium ">Payment Date</span>
                        <span className="text-sm ">
                            {getCompanyid?.paydate ? formatDate(getCompanyid?.paydate) : <UpdateCompany companyId={id}/>}
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