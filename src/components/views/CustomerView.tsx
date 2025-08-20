import { ColumnDef } from "@tanstack/react-table";
import { CustomerTableWrapper }from "../customerTableWrapper/CustomerTableWrapper";
type Clients = {
    id: string
    status: "active" | "inactive"
    email: string
    fullName: string
    phone: string
    address: string
    nextBillingDate: string
    balanceDue: number
}

export const clients: Clients[] = [
    {
        id: "728ed52f",
        fullName: "John Doe",
        status: "active",
        email: "m@example.com",
        phone: "123-456-7890",
        address: "Nunez de cacerez 14a, Bellavista, Santiago, DOM",
        nextBillingDate: "2025-08-20",
        balanceDue: 100,
    },
    {
        id: "489e1d42",
        status: "inactive",
        email: "example@gmail.com",
        fullName: "John Doe",
        phone: "123-456-7890",
        address: "Cerro alto 23b, Donato, Santiago, DOM",
        nextBillingDate: "2025-08-20",
        balanceDue: 100,
    },
    // ...
]

export const columns: ColumnDef<Clients>[] = [
    {
        accessorKey: "status",
        header: "Status",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "fullName",
        header: "Full Name",
    },
    {
        accessorKey: "phone",
        header: "Phone",
    },
    {
        accessorKey: "address",
        header: "Address",
    },
    {
        accessorKey: "nextBillingDate",
        header: "Next Billing Date",
    },
    {
        accessorKey: "balanceDue",
        header: () => <div className="text-right">Balance Due</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("balanceDue"))
      const formatted = new Intl.NumberFormat("es-DO", {
        style: "currency",
        currency: "DOP",
      }).format(amount)
 
      return <div className="text-right font-medium">{formatted}</div>
    },
    },
]
export default function CustomerView() {
    return (
        <>
            <CustomerTableWrapper columns={columns} data={clients}/>
        </>
    )
}