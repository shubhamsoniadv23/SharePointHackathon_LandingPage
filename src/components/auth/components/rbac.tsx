// import React, { ReactNode } from "react";
// import { useSelector } from 'react-redux';
// import { useLocation, Navigate } from 'react-router-dom';
// import { RootState } from '../../../store/store';
// import { LOGIN_ROUTE } from '../../../constants/constant';
// import { LoadingStatus } from "../../../types/stateTypes";
// import Loader from "../../shared/loader/loader";

// interface RbacProps {
//     children: ReactNode;
//     allowedRoles: string[];
// }

// const Rbac = ({ children, allowedRoles }: RbacProps) => {
//     const location = useLocation();
//     const { userDetails, isAuthenticated } = useSelector((state: RootState) => state.auth);
//     const status = useSelector((state: RootState) => state.loading.status); // loading status if using centralized loading
//     const loading = status === LoadingStatus.LOADING;  // Update the logic based on the loading status
    
//     if (LoadingStatus.LOADING === status) {
//         <Loader />;
//     }
//     if (!userDetails && loading) {
//         return <Navigate to={LOGIN_ROUTE} state={{ from: location }} replace />;
//     }

//     // const hasRequiredRole = allowedRoles.some((role) =>
//     //     userDetails!.Roles.find((r: any) => r.RoleName === role)
//     // );
//     const hasRequiredRole = true; // Update this to your logic
//     console.error("Update the hasRequiredRole logic in Rbac.tsx file");

//     if (!hasRequiredRole) {
//         return (
//             <>
//                 <p> Access Denied</p>
//             </>
//         );
//     }
//     return children;
// };
// export default Rbac;