import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import { ApartmentCreatePage } from "@/pages/apartments/ApartmentCreatePage";
import { ApartmentDetailsPage } from "@/pages/apartments/ApartmentDetailsPage";
import { ApartmentEditPage } from "@/pages/apartments/ApartmentEditPage";
import { ApartmentListPage } from "@/pages/apartments/ApartmentListPage";
import { CustomerCreatePage } from "@/pages/customers/CustomerCreatePage";
import { CustomerDetailsPage } from "@/pages/customers/CustomerDetailsPage";
import { CustomerEditPage } from "@/pages/customers/CustomerEditPage";
import { CustomerListPage } from "@/pages/customers/CustomerListPage";
import { LoginPage } from "@/pages/LoginPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ReservationListPage } from "@/pages/reservations/ReservationListPage";
import { SaleListPage } from "@/pages/sales/SaleListPage";
import { tokenStorage } from "@/utils/storage";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const token = tokenStorage.get();
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />

                <Route
                    element={
                        <PrivateRoute>
                            <AppLayout />
                        </PrivateRoute>
                    }
                >
                    <Route path="/" element={<Navigate to="/apartamentos" replace />} />

                    <Route path="/apartamentos" element={<ApartmentListPage />} />
                    <Route path="/apartamentos/new" element={<ApartmentCreatePage />} />
                    <Route path="/apartamentos/:id" element={<ApartmentDetailsPage />} />
                    <Route path="/apartamentos/:id/edit" element={<ApartmentEditPage />} />

                    <Route path="/clientes" element={<CustomerListPage />} />
                    <Route path="/clientes/new" element={<CustomerCreatePage />} />
                    <Route path="/clientes/:id" element={<CustomerDetailsPage />} />
                    <Route path="/clientes/:id/edit" element={<CustomerEditPage />} />

                    <Route path="/reservas" element={<ReservationListPage />} />
                    <Route path="/vendas" element={<SaleListPage />} />
                </Route>

                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
};
