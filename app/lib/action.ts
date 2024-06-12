'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import Form from '../ui/invoices/create-form';

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending', 'paid']),
    date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

/*
Error when using this:
Type '({ formData }: { formData: FormData; }) => Promise<void>' is not assignable to type 'string | ((formData: FormData) => void) | undefined'.
Type '({ formData }: { formData: FormData; }) => Promise<void>' is not assignable to type '(formData: FormData) => void'.
Types of parameters '__0' and 'formData' are incompatible.
Property 'formData' is missing in type 'FormData' but required in type '{ formData: FormData; }'.ts(2322)
*/
// export async function createInvoice({ formData }: { formData: FormData }) { }


export async function createInvoice(formData: FormData) {
    // const rawFormData = {
    const { customerId, amount, status } = CreateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    // console.log(rawFormData); 
    // console.log(typeof rawFormData.amount);

    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function updateInvoice(id: string, formData: FormData) {
    const { customerId, amount, status } = UpdateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    const amountInCents = amount * 100;

    await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
    `;

    revalidatePath('/dashboard/invoices')
    redirect('/dashboard/invoices')
}


export async function deleteInvoice(id: string) {
    await sql`
        DELETE FROM invoices
        WHERE id = ${id}
    `;

    revalidatePath('/dashboard/invoices');
}