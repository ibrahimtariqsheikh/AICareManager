import { MyNavbar } from "../../components/Navbar"

const PricingLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex flex-col min-h-screen w-full">
            <MyNavbar />
            {children}
        </div>
    )
}

export default PricingLayout;