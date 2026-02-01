import { Button } from "@/components/ui/button";
import {
    Card,
    CardAction,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Eye } from "lucide-react";
import { Link } from "react-router";


interface CardItem {
    id: number;
    name: string;
    link: string;
    madeNot: boolean;
    authRequired?: string; // role name
}

const cardData: CardItem[] = [
    {
        id: 1,
        name: "Company Registration",
        link: "/company-register",
        madeNot: true,
    },
    {
        id: 2,
        name: "Company View & Manage",
        link: "/get-company",
        madeNot: true,
    }, {
        id: 3,
        name: "Payment Monthly",
        link: "/get-payment",
        madeNot: true,
    },
    {
        id: 4,
        name: "Payment Half Yearly",
        link: "/get-payment",
        madeNot: true,
    }, {
        id: 5,
        name: "Payment Yearly",
        link: "/get-payment",
        madeNot: true,
    }
];

const MainHome = () => {
    return (
        <div>
            {cardData.map((item) => (
                <Card key={item.id} className="mb-3">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>{item.name}</CardTitle>

                        {item.madeNot === false ? (
                            <span className="text-sm text-red-500">Not Available</span>
                        ) : (
                            <CardAction className="space-x-2">
                                <Link to={item.link}>
                                    <Button className=" cursor-pointer">
                                        <Eye className="mr-2 h-4 w-4" />
                                        View
                                    </Button>
                                </Link>
                            </CardAction>
                        )}
                    </CardHeader>
                </Card>
            ))}
        </div>
    )
}

export default MainHome