"use client"

// ** Imports (client component) ** \\
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import RegistrationComponent from "./RegistrationComponent";
import LoginComponent from "./LoginComponent";
import Navbar from "../ui/Navbar";
import PublicRouteProvider from "@/app/providers/PublicRouteProvider";

// ** Type to keep the valid auth routes in check ** \\
type ValidAuthRoute = "register" | "login";


// ** Component ** \\
const AuthPage = (): React.ReactElement => {
    //   ** Router definition for changing routes ** \\
    const router = useRouter();

    //   ** Search params definition to use query/search ** \\
    const searchParams = useSearchParams();

    //  ** Array to store valid auth routes ** \\
    const validAuthRoutes: ValidAuthRoute[] = ["register", "login"];

    //  ** Container for the current route the user is on ** \\
    const currentRoute: ValidAuthRoute | null = searchParams.get("auth") as ValidAuthRoute | null;

    //   ** UseEffect to handle default route and invalid routes ** \\
    useEffect(() => {
        let isComponentMounted = true;

        if (!currentRoute || !validAuthRoutes.includes(currentRoute)) {
            if (isComponentMounted) router.replace("/?auth=register");
        };

        // ** Clean up function ** \\
        return () => { isComponentMounted = false; }
    }, [router]);

    //   ** Custom tailwind classes ** \\
    const centralizedFlexBox = `flex justify-center items-center`

    //   ** Function to conditionally render the valid auth component ** \\
    const renderAuthComponent = (): React.ReactElement => {
        if (currentRoute === "register") return <RegistrationComponent />
        if (currentRoute === "login") return <LoginComponent />

        return <></>
    }
    return (
        <PublicRouteProvider>
            <main
                className="flex flex-col h-screen bg-white"
            >
                <Navbar />
                <main className={`${centralizedFlexBox} flex-1 bg-white`}>
                    {renderAuthComponent()}
                </main>
            </main>
        </PublicRouteProvider>
    );
};

// ** Component export ** \\
export default AuthPage;