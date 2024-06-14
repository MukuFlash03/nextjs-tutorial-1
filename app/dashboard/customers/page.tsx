import Pagination from "@/app/ui/invoices/pagination";
import Search from "@/app/ui/search";
import CustomersTable from "@/app/ui/customers/table";
// import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { lusitana } from "@/app/ui/fonts";
import { Suspense } from "react";
import { fetchFilteredCustomers } from "@/app/lib/data";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Customers',
};

export default async function Page({
    searchParams
}: {
    searchParams?: {
        query?: string,
        page?: string,
    };
}) {
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;

    const customers = await fetchFilteredCustomers(query);

    return (
        <main>
            <CustomersTable customers={customers} />
        </main>
    )
}