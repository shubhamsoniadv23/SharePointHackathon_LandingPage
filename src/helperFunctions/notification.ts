// import "react-toastify/dist/ReactToastify.css";
// import { toast, ToastOptions, TypeOptions, Id } from "react-toastify";

// // Define the base toast configuration type
// interface ToastConfig extends ToastOptions {
//   position:
//     | "top-right"
//     | "top-center"
//     | "top-left"
//     | "bottom-right"
//     | "bottom-center"
//     | "bottom-left";
//   theme: "light" | "dark" | "colored";
// }

// // Default configuration for all notifications
// const defaultToastConfig: ToastConfig = {
//   position: "top-center",
//   autoClose: 4000,
//   hideProgressBar: false,
//   closeOnClick: true,
//   pauseOnHover: true,
//   draggable: true,
//   progress: undefined,
//   theme: "light",
// };

// // Store to keep track of displayed toast IDs
// const displayedToastIds = new Set<Id>();

// // Track the last notification and its count
// interface LastNotification {
//   text: string;
//   type: TypeOptions;
//   count: number;
// }

// let lastNotification: LastNotification | null = null;

// /**
//  * Displays a toast notification with the specified text and type.
//  * Prevents the same notification from being shown more than twice in a row.
//  *
//  * @param notificationText - The text to display in the notification
//  * @param notificationType - The type of notification (success, error, info, warning)
//  * @param customConfig - Optional custom configuration to override defaults
//  * @returns The toast instance or null if notification was blocked
//  */
// export const notify = (
//   notificationText: string,
//   notificationType: TypeOptions,
//   customConfig?: Partial<ToastConfig>
// ) => {
//   // Check if this is the same notification as the last one
//   if (
//     lastNotification &&
//     lastNotification.text === notificationText &&
//     lastNotification.type === notificationType
//   ) {
//     // If we've already shown this notification twice, block it
//     if (lastNotification.count >= 2) {
//       console.log(
//         "Notification blocked - already shown twice in a row:",
//         notificationText
//       );
//       return null;
//     }
//     // Increment the count for this notification
//     lastNotification.count++;
//   } else {
//     // This is a different notification, reset the tracking
//     lastNotification = {
//       text: notificationText,
//       type: notificationType,
//       count: 1,
//     };
//   }

//   const config = {
//     ...defaultToastConfig,
//     ...customConfig,
//   };

//   const toastId = (toast as any)[notificationType](notificationText, {
//     ...config,
//     onOpen: (id: Id) => {
//       displayedToastIds.add(id);
//     },
//     onClose: (id: Id) => {
//       displayedToastIds.delete(id);
//     },
//   });

//   if (!displayedToastIds.has(toastId)) {
//     return toastId;
//   }
// };

// export const clearNotifications = () => {
//   toast.clearWaitingQueue();
//   displayedToastIds.clear();
//   lastNotification = null; // Reset the last notification tracking
// };

// // Convenience methods for common notification types
// export const notifySuccess = (text: string, config?: Partial<ToastConfig>) =>
//   notify(text, "success", config);

// export const notifyError = (text: string, config?: Partial<ToastConfig>) =>
//   notify(text, "error", config);

// export const notifyInfo = (text: string, config?: Partial<ToastConfig>) =>
//   notify(text, "info", config);

// export const notifyWarning = (text: string, config?: Partial<ToastConfig>) =>
//   notify(text, "warning", config);
