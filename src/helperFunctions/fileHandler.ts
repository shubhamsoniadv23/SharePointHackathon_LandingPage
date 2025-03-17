
// import { apiGet } from "../services/httpService"; // update with API services used 
// import { notifyError, notifySuccess } from "./notification";

// export const fileDownload = async (fileUrl: string): Promise<void> => {
//   try {
//     const fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
//     const response = await apiGet(
//       `${"DOCENDPOINT"}/?docUrl=${encodeURIComponent(fileUrl)}` //Replace DOCENDPOINT with your API endpoint
//     );
//     const data = response.data as {
//       success: boolean;
//       message: string;
//       data: string;
//     };

//     if (data.success) {
//       const link = document.createElement("a");
//       link.href = `data:application/octet-stream;base64,${data.data}`;
//       link.download = fileName;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       notifySuccess("FILEDOWNLOADSUCCESSMESSAGE"); //Replace FILEDOWNLOADSUCCESSMESSAGE with your success message
//     } else {
//       notifyError("FILENOTFOUNDMESSAGE"); //Replace FILENOTFOUNDMESSAGE with your error message
//     }
//   } catch (error) {
//     console.error("Error downloading file:", error);
//     notifyError("FILENOTFOUNDMESSAGE"); //Replace FILENOTFOUNDMESSAGE with your error message
//   }
// };

// export const fileViewer = async (fileUrl: string): Promise<void> => {
//   try {
//     const response = await apiGet(
//       `${"DOCENDPOINT"}/?docUrl=${encodeURIComponent(fileUrl)}` //Replace DOCENDPOINT with your API endpoint
//     );
//     const data = response.data as {
//       success: boolean;
//       message: string;
//       data: string;
//     };

//     if (data.success) {
//       const fileExtension = fileUrl.split(".").pop()?.toLowerCase() || "";
//       const mimeTypes: { [key: string]: string } = {
//         pdf: "application/pdf",
//         jpg: "image/jpeg",
//         jpeg: "image/jpeg",
//         png: "image/png",
//       };
//       const mimeType = mimeTypes[fileExtension] || "application/octet-stream";

//       const fileBlob = new Blob(
//         [Uint8Array.from(atob(data.data), (c) => c.charCodeAt(0))],
//         { type: mimeType }
//       );

//       const objectUrl = URL.createObjectURL(fileBlob);
//       window.open(objectUrl, "_blank");
//       URL.revokeObjectURL(objectUrl);
//     } else {
//       notifyError("FILENOTFOUNDMESSAGE"); //Replace FILENOTFOUNDMESSAGE with your error message
//     }
//   } catch (error) {
//     console.error("Error fetching file:", error);
//     notifyError("FILENOTFOUNDMESSAGE"); //Replace FILENOTFOUNDMESSAGE with your error message
//   }
// };
