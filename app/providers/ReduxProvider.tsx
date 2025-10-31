"use client"

// ** Imports (client component) ** \\
import { store } from "../../redux/store"
import { Provider } from "react-redux"

// ** Component ** \\
const ReduxProvider = (
    { children }:
    { children: React.ReactNode }
): React.ReactElement => {
    return (
        <Provider
            store={store}
        >
            {children}
        </Provider>
    )
}

// ** Component export ** \\
export default ReduxProvider;