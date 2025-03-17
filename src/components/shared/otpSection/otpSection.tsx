// import React from "react";
// import { Box, styled, Input as BaseInput } from "@mui/material";

// interface OTPProps {
//   separator: React.ReactNode;
//   length: number;
//   value: string;
//   onChange: (value: string) => void;
//   disabled?: boolean;
// }

// interface OTPInputProps {
//   onComplete?: (otp: string) => void;
//   disabled?: boolean;
//   length?: number;
// }

// interface InputElementProps {
//   ref: (element: HTMLInputElement) => void;
//   onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
//   onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
//   onPaste: (event: React.ClipboardEvent<HTMLInputElement>) => void;
//   value: string;
//   disabled?: boolean;
// }

// const OTP: React.FC<OTPProps> = ({
//   separator,
//   length,
//   value,
//   onChange,
//   disabled = false,
// }) => {


//   const inputRefs = React.useRef<HTMLInputElement[]>(
//     new Array(length).fill(null)
//   );

//   const focusInput = (targetIndex: number) => {
//     const targetInput = inputRefs.current[targetIndex];
//     if (targetInput) targetInput.focus();
//   };

//   const selectInput = (targetIndex: number) => {
//     const targetInput = inputRefs.current[targetIndex];
//     if (targetInput) targetInput.select();
//   };

//   const isNumeric = (value: string): boolean => {
//     return /^\d*$/.test(value);
//   };

//   const handlePasteContent = (content: string, currentIndex: number) => {
//     const numericData = content.replace(/\D/g, "").slice(0, length - currentIndex);

//     if (numericData) {
//       const updatedOTP = value.split("");
//       for (let i = 0; i < numericData.length; i++) {
//         if (currentIndex + i < length) {
//           updatedOTP[currentIndex + i] = numericData[i];
//         }
//       }
//       onChange(updatedOTP.join(""));

//       // Focus the next empty input after pasting
//       const nextEmptyIndex = updatedOTP.findIndex((digit, index) => index >= currentIndex && !digit);
//       if (nextEmptyIndex !== -1) {
//         focusInput(nextEmptyIndex);
//       } else {
//         focusInput(length - 1);
//       }
//     }
//   };

//   const handleKeyDown = (
//     event: React.KeyboardEvent<HTMLInputElement>,
//     currentIndex: number
//   ) => {
//     if (disabled) return;

//     // Handle keyboard shortcuts
//     if (event.ctrlKey || event.metaKey) {
//       switch (event.key.toLowerCase()) {
//         case 'v': // Handle paste
//           navigator.clipboard.readText().then(text => {
//             handlePasteContent(text, currentIndex);
//           });
//           event.preventDefault();
//           return;
//         case 'c': // Allow copy
//         case 'x': // Allow cut
//           return;
//         default:
//           break;
//       }
//     }

//     switch (event.key) {
//       case "ArrowUp":
//       case "ArrowDown":
//       case " ":
//         event.preventDefault();
//         break;
//       case "ArrowLeft":
//         event.preventDefault();
//         if (currentIndex > 0) {
//           focusInput(currentIndex - 1);
//           selectInput(currentIndex - 1);
//         }
//         break;
//       case "ArrowRight":
//         event.preventDefault();
//         if (currentIndex < length - 1) {
//           focusInput(currentIndex + 1);
//           selectInput(currentIndex + 1);
//         }
//         break;
//       case "Delete":
//         event.preventDefault();
//         const newValueAfterDelete = value.slice(0, currentIndex) + value.slice(currentIndex + 1);
//         onChange(newValueAfterDelete);
//         if (currentIndex < length - 1) {
//           focusInput(currentIndex);
//         }
//         break;
//       case "Backspace":
//         event.preventDefault();
//         const newValueAfterBackspace = value.slice(0, currentIndex) + value.slice(currentIndex + 1);
//         onChange(newValueAfterBackspace);
//         if (currentIndex > 0) {
//           focusInput(currentIndex - 1);
//           selectInput(currentIndex - 1);
//         }
//         break;
//       default:
//         // Prevent non-numeric key input
//         if (
//           !isNumeric(event.key) &&
//           !["Tab", "ArrowLeft", "ArrowRight", "Backspace", "Delete"].includes(event.key)
//         ) {
//           event.preventDefault();
//         }
//         break;
//     }
//   };

//   const handleChange = (
//     event: React.ChangeEvent<HTMLInputElement>,
//     currentIndex: number
//   ) => {
//     if (disabled) return;

//     const currentValue = event.target.value;
//     const newValue = currentValue[currentValue.length - 1] || "";
//     if (isNumeric(newValue) || newValue === "") {
//       const updatedOTP = value.split("");
//       updatedOTP[currentIndex] = newValue;
//       onChange(updatedOTP.join(""));

//       if (newValue && currentIndex < length - 1) {
//         focusInput(currentIndex + 1);
//       }
//     }
//   };

//   const handlePaste = (
//     event: React.ClipboardEvent<HTMLInputElement>,
//     currentIndex: number
//   ) => {
//     if (disabled) return;
//     event.preventDefault();
//     const pastedData = event.clipboardData.getData("text/plain");
//     handlePasteContent(pastedData, currentIndex);
//   };

//   return (
//     <Box sx={{ display: "flex", gap: "1rem", alignItems: "center", justifyContent: "center" }}>
//       {Array(length)
//         .fill(null)//         .map((_, index) => (
//           <React.Fragment key={index}>
//             <BaseInput
//               inputProps={{
//                 ref: (ele: HTMLInputElement) => {
//                   inputRefs.current[index] = ele;
//                 },
//                 onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) =>
//                   handleKeyDown(event, index),
//                 onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
//                   handleChange(event, index),
//                 onPaste: (event: React.ClipboardEvent<HTMLInputElement>) =>
//                   handlePaste(event, index),
//                 value: value[index] || "",
//                 disabled: disabled,
//                 inputMode: "numeric",
//                 pattern: "[0-9]*",
//                 style: {
//                   width: "40px",
//                   fontSize: "1.5rem",
//                   padding: "8px 0",
//                   textAlign: "center",
//                   borderRadius: "8px",
//                 },
//               }}
//               disabled={disabled}
//               aria-label={`Digit ${index + 1} of OTP`}
//             />
//             {index === length - 1 ? null : separator}
//           </React.Fragment>
//         ))}
//     </Box>
//   );
// };

// const StyledInput = styled(BaseInput)(({ theme }) => ({
//   "& .MuiInputBase-input": {
//     width: "40px",
//     fontSize: "1.5rem",
//     padding: "8px 0",
//     textAlign: "center",
//     borderRadius: "8px",
//     border: `1px solid ${theme.palette.divider}`,
//     background: theme.palette.background.paper,
//     color: theme.palette.text.primary,
//     transition: "all 0.2s",

//     "&:hover": {
//       borderColor: theme.palette.primary.main,
//     },

//     "&:focus": {
//       outline: "none",
//       borderColor: theme.palette.primary.main,
//       boxShadow: `0 0 0 2px ${theme.palette.primary.light}40`,
//     },

//     "&:disabled": {
//       background: theme.palette.action.disabledBackground,
//       borderColor: theme.palette.action.disabled,
//       color: theme.palette.action.disabled,
//     },
//   },
// }));

// export default OTP;