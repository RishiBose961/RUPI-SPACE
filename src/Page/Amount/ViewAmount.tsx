import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router";

const ViewAmount = ({id}:{id:string | undefined}) => {

    return (
        <Card className="w-full mt-4">
            <CardHeader>
                <CardTitle>Action</CardTitle>
                <CardDescription>View & Manage</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                <div className="grid grid-cols-4 gap-4">
                    <Link to={`/get-payment/${id}`}>
                        <Button>
                            View Amount
                        </Button>
                    </Link>

                </div>
            </CardContent>
        </Card>
    )
}

export default ViewAmount