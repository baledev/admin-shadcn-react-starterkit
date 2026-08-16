import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"

import { CustomerDataTable } from "@/components/customer-data-table"
import { customersData } from "@/lib/customers-data"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@workspace/ui/components/select"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@workspace/ui/components/sheet"
import { IconPlus } from "@tabler/icons-react"

export const Route = createFileRoute("/_auth/customers")({
    component: CustomersPage,
})

function CustomersPage() {
    const [open, setOpen] = React.useState(false)

    return (
        <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                    <div className="flex items-center justify-between px-1">
                        <div>
                            <h1 className="text-xl font-semibold">Customers</h1>
                            <p className="text-sm text-muted-foreground">
                                Manage your customer accounts and subscriptions.
                            </p>
                        </div>
                        <Sheet open={open} onOpenChange={setOpen}>
                            <SheetTrigger
                                render={<Button size="sm" />}
                            >
                                <IconPlus className="size-4" />
                                Add Customer
                            </SheetTrigger>
                            <SheetContent side="right" className="sm:max-w-md">
                                <SheetHeader>
                                    <SheetTitle>Add Customer</SheetTitle>
                                    <SheetDescription>
                                        Fill in the details below to add a new customer.
                                    </SheetDescription>
                                </SheetHeader>
                                <AddCustomerForm onSuccess={() => setOpen(false)} />
                            </SheetContent>
                        </Sheet>
                    </div>
                    <CustomerDataTable data={customersData} />
                </div>
            </div>
        </div>
    )
}

function AddCustomerForm({ onSuccess }: { onSuccess: () => void }) {
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsSubmitting(true)
        // Simulate async submit
        setTimeout(() => {
            setIsSubmitting(false)
            onSuccess()
        }, 800)
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-1 flex-col overflow-hidden"
        >
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-2">
                {/* Name */}
                <div className="flex flex-col gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                        id="name"
                        name="name"
                        placeholder="Alice Johnson"
                        required
                    />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="alice@example.com"
                        required
                    />
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+1 555-0100"
                    />
                </div>

                {/* Country */}
                <div className="flex flex-col gap-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                        id="country"
                        name="country"
                        placeholder="United States"
                    />
                </div>

                {/* Status + Plan side by side */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="status">Status</Label>
                        <Select name="status" defaultValue="active">
                            <SelectTrigger id="status" className="w-full">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="plan">Plan</Label>
                        <Select name="plan" defaultValue="free">
                            <SelectTrigger id="plan" className="w-full">
                                <SelectValue placeholder="Select plan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="free">Free</SelectItem>
                                <SelectItem value="pro">Pro</SelectItem>
                                <SelectItem value="enterprise">Enterprise</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Total Spend */}
                <div className="flex flex-col gap-2">
                    <Label htmlFor="totalSpend">Total Spend (USD)</Label>
                    <Input
                        id="totalSpend"
                        name="totalSpend"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        defaultValue="0"
                    />
                </div>
            </div>

            <SheetFooter>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Customer"}
                </Button>
                <SheetClose
                    render={<Button variant="outline" type="button" />}
                >
                    Cancel
                </SheetClose>
            </SheetFooter>
        </form>
    )
}
