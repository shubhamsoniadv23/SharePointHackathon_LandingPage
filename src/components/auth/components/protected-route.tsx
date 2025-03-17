// import React, { useEffect, useState } from "react";
// import { Navigate, useLocation, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "../../../store/store";
// import {
//     setAuthenticationStatus,
//     setUserDetails,
// } from "../../../store/slice/auth-slice";
// import useGet from "../../../hooks/useGet";
// import {
//     DASHBOARD_ROUTE,
//     LOGIN_ROUTE,

//     MASTER_DATA_ENDPOINT,

//     USER_ME_ENDPOINT,

// } from "../../../constants/constant";
// import { updateMasterData } from "../../../store/slice/master-slice";
// import Loader from "../../shared/loader/loader";
// import { LoadingStatus } from "../../../types/stateTypes";

// interface ProtectedRouteProps {
//     children: JSX.Element;
// }

// export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
//     children,
// }: ProtectedRouteProps) => {
//     const dispatch = useDispatch<AppDispatch>();
//     const navigate = useNavigate();
//     const location = useLocation();
//     const [isMounted, setIsMounted] = useState(false);
//     const { data, loading, error } = useGet<any>(USER_ME_ENDPOINT);
//     const {
//         data: MasterData,
//         loading: masterLoading,
//         error: masterError,
//     } = useGet<any>(MASTER_DATA_ENDPOINT);


//     const { isAuthenticated, userDetails, loadingStatus, applicationData } = useSelector(
//         (state: RootState) => ({
//             isAuthenticated: state.auth.isAuthenticated,
//             userDetails: state.auth.userDetails,
//             loadingStatus: state.loading.status,
//             applicationData: state.application.data
//         })
//     );


//     useEffect(() => {
//         setIsMounted(true);
//         return () => {
//             setIsMounted(false);
//         };
//     }, []);

//     useEffect(() => {
//         if (!loading && !error) {
//             dispatch(
//                 setAuthenticationStatus({
//                     isAuthenticated: true,
//                 })
//             );
//             dispatch(setUserDetails(data));
//             navigate(DASHBOARD_ROUTE); // Update this to your dashboard route

//         }
//         if (!masterLoading && !masterError) {
//             dispatch(updateMasterData(MasterData));

//         }
//     }, [loading, error, masterLoading, masterError]);


//     if (loading) return <Loader />;

//     if (loadingStatus == LoadingStatus.ERROR) {
//         return <Navigate to={LOGIN_ROUTE} state={{ from: location }} replace />;
//     }

//     if ((!isAuthenticated && error) || (!userDetails && error)) {
//         return <Navigate to={LOGIN_ROUTE} state={{ from: location }} replace />;
//     }

//     return <>{children}</>;
// };
