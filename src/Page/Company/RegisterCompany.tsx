import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { type ChangeEvent, type FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSelector } from "react-redux";
import CheckEnvironment from "@/CheckEnvironment/CheckEnvironment";

// ---------------- TYPES ----------------
type CompanyForm = {
  id: string;
  companyname: string;
  name: string;
  paydate: string;
  payplan: "monthly" | "halfyearly" | "yearly";
};

type CompanyPayload = Omit<CompanyForm, "id">;

type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

const createEmptyCompany = (): CompanyForm => ({
  id: crypto.randomUUID(),
  companyname: "",
  name: "",
  paydate: "",
  payplan: "monthly",
});

const RegisterCompany = () => {
  const { user } = useSelector(
    (state: { auth: { user: { token: string; _id: string } } }) => state.auth
  );

  const { base_url } = CheckEnvironment();

  const [companies, setCompanies] = useState<CompanyForm[]>([
    createEmptyCompany(),
  ]);

  // ---------------- API CALL ----------------
  const mutation = useMutation({
    mutationFn: async (data: CompanyPayload[]) => {
      const res = await axios.post(
        `${base_url}/api/companies/create`,
        data,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      return res.data;
    },
    onSuccess: () => {
      alert("Companies registered successfully 🎉");
      setCompanies([createEmptyCompany()]);
    },
    onError: (err: ApiError) => {
      alert(err.response?.data?.message || "Something went wrong");
    },
  });

  // ---------------- HANDLERS ----------------
  const handleChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setCompanies((prev) =>
      prev.map((company, i) =>
        i === index ? { ...company, [name]: value } : company
      )
    );
  };

  const handleSelectChange = (
    index: number,
    value: CompanyForm["payplan"]
  ) => {
    setCompanies((prev) =>
      prev.map((company, i) =>
        i === index ? { ...company, payplan: value } : company
      )
    );
  };

  const addCompany = () => {
    setCompanies((prev) => {
      if (prev.length >= 5) {
        alert("Maximum 5 companies allowed");
        return prev;
      }
      return [...prev, createEmptyCompany()];
    });
  };

  const removeCompany = (index: number) => {
    setCompanies((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Remove id before sending to backend
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const payload = companies.map(({ id, ...rest }) => rest);
    mutation.mutate(payload);
  };

  // ---------------- UI ----------------
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Register Companies</CardTitle>
        <CardDescription>Add up to 1 or 5 companies</CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {companies.map((company, index) => (
            <div key={company.id} className="border p-4 rounded-lg space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Company Name</Label>
                  <Input
                    className="uppercase"
                    name="companyname"
                    placeholder="Enter Company Name"
                    value={company.companyname}
                    onChange={(e) => handleChange(index, e)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label>Name</Label>
                  <Input
                    name="name"
                    placeholder="Enter Name"
                    value={company.name}
                    onChange={(e) => handleChange(index, e)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label>Payment Date</Label>
                  <Input
                    name="paydate"
                    type="date"
                    value={company.paydate}
                    onChange={(e) => handleChange(index, e)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label>Payment Plan</Label>
                  <Select
                    value={company.payplan}
                    onValueChange={(value) =>
                      handleSelectChange(index, value as CompanyForm["payplan"])
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="halfyearly">Half Yearly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {companies.length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => removeCompany(index)}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
        </CardContent>

        <CardFooter className="flex justify-between mt-5">
          <Button
            type="button"
            onClick={addCompany}
            disabled={companies.length >= 5}
          >
            Add More Company
          </Button>

          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Submitting..." : "Submit"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default RegisterCompany;
