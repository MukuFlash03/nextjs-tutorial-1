'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error: "Please select a customer.",
    }),
    amount: z.coerce
        .number()
        .gt(0, { message: "Please enter an amount greater than $0." }),
    status: z.enum(['pending', 'paid'], {
        invalid_type_error: "Please select an invoice status.",
    }),
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

export type State = {
    errors?: {
        customerId?: string[],
        amount?: string[],
        status?: string[],
    },
    message?: string | null,
};

export async function createInvoice(
    prevState: State,
    formData: FormData,
) {
    // const rawFormData = {
    // const { customerId, amount, status } = CreateInvoice.parse({

    // Validated fields using Zod
    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    // console.log(validatedFields);
    // console.log(prevState);

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing fields. Failed to Create Invoice.",
        };
    }

    // console.log(rawFormData); 
    // console.log(typeof rawFormData.amount);

    // Prepared data after validation for insertion into the database
    const { customerId, amount, status } = validatedFields.data;

    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    try {
        await sql`
            INSERT INTO invoices (customer_id, amount, status, date)
            VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
        `;
    } catch (error) {
        return {
            message: `Database error: Failed to Create Invoice.\n\n${error}`,
        };
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function updateInvoice(
    id: string,
    prevState: State,
    formData: FormData,
) {
    // const { customerId, amount, status } = UpdateInvoice.parse({

    // Validated fields using Zod
    const validatedFields = UpdateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing fields. Failed to Update Invoice",
        }
    }

    // Prepared data after validation for updating into the database
    const { customerId, amount, status } = validatedFields.data;

    const amountInCents = amount * 100;

    try {
        await sql`
            UPDATE invoices
            SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
            WHERE id = ${id}
        `;
    } catch (error) {
        return {
            message: `Database error: Failed to Update Invoice.\n\n${error}`,
        };
    }

    revalidatePath('/dashboard/invoices')
    redirect('/dashboard/invoices')
}


export async function deleteInvoice(
    id: string
) {
    // throw new Error('Failed to Delete Invoice');
    try {
        await sql`
            DELETE FROM invoices
            WHERE id = ${id}
        `;
    } catch (error) {
        return {
            message: `Database error: Failed to Delete Invoice.\n\n${error}`,
        };
    }

    revalidatePath('/dashboard/invoices');
}

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return "Invalid credentials.";
                default:
                    return "Something went wrong.";
            }
        }
        throw error;
    }
}