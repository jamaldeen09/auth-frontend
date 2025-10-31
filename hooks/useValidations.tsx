"use client"
// ** Imports (all client components) ** \\
import z from "zod";

// ** Function to get email and password validation as they will both be used ** \\
const getDefaultAuthValidation = () => {
    return z.object({
        email: z.email({ error: "Invalid email address" }),
        password: z.string()
            .min(6, { error: "Password must be at least 6 characters " })
            .regex(/.*[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~].*/, { error: "Password must contain at least 1 special character" }),
    })
}

// ** Registration validation custom hook ** \\
const useRegistrationValidation = () => {
    return getDefaultAuthValidation().extend({
        name: z.string().min(2, { error: "Name must be at least 2 characters" }).max(120, { error: "Name cannot exceed 120 chracters" }),
    });
}

// ** Login validaation custom hook ** \\
const useLoginValidation = () => {
    return getDefaultAuthValidation();
}

// ** Export both hooks ** \\
export { useRegistrationValidation, useLoginValidation }