import React, { useState, useEffect } from "react";
import { SPHttpClient } from "@microsoft/sp-http";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Box,
  CircularProgress,
  Stack,
  Chip
} from "@mui/material";
import { ISharedComponentProps } from "../../../webparts/landingPage/components/ILandingPageProps";
import { Send } from "@mui/icons-material";
import * as dayjs from "dayjs";
import { initializeOrCreateList } from "../../../helperFunctions/sharePointListHandler";
import { typographyStyles } from "../../../constants/constant";

interface IWorkAnniversary {
  id: string;
  displayName: string;
  employeeHireDate: string;
  officeLocation: string;
  jobTitle: string;
}

interface IWishedUser {
  sender: string;
  receiver: string;
}

const WorkAnniversaryComponent: React.FC<ISharedComponentProps> = ({ context }) => {
  const [workAnniversaries, setWorkAnniversaries] = useState<IWorkAnniversary[]>([]);
  const [selectedUser, setSelectedUser] = useState<IWorkAnniversary | null>(null);
  const [wishMessage, setWishMessage] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [wishedUsers, setWishedUsers] = useState<IWishedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getYearsOfService = (hireDate: string): number => {
    const hire = dayjs(hireDate);
    const now = dayjs();
    return now.diff(hire, 'year');
  };

  const isCurrentMonthAnniversary = (hireDate: string): boolean => {
    const hire = dayjs(hireDate);
    const now = dayjs();
    return hire.month() === now.month();
  };

  const getNextAnniversaryDate = (hireDate: string): string => {
    const hire = dayjs(hireDate);
    const now = dayjs();
    const thisYearAnniversary = hire.year(now.year());
    return thisYearAnniversary.format("MMMM DD");
  };

  const getWorkAnniversaries = async (): Promise<void> => {
    try {
      const msGraphClient = await context.msGraphClientFactory.getClient("3");
      const response = await msGraphClient
        .api("/users")
        .version("beta")
        .select("id,displayName,employeeHireDate,officeLocation,jobTitle")
        .get();

      let currentMonthAnniversaries: IWorkAnniversary[] = response.value
        .filter((user: any) => user.employeeHireDate && isCurrentMonthAnniversary(user.employeeHireDate))
        .map((user: any) => ({
          id: user.id,
          displayName: user.displayName,
          employeeHireDate: user.employeeHireDate,
          officeLocation: user.officeLocation || 'Not specified',
          jobTitle: user.jobTitle || 'Not specified',
        }));
      if (currentMonthAnniversaries.length === 0) {

        currentMonthAnniversaries = Array.from({ length: 3 }, (_, index) => {
          const dummyDate = dayjs().subtract(1, 'year').date(index + 1).format("YYYY-MM-DD");
          const UserName = ['Any Dey', 'John Doe', 'James Daneil'];

          return {
            id: `dummy-${index + 1}`,
            displayName: `${UserName[index]}`, // Correctly indexing the array
            employeeHireDate: dummyDate,
            officeLocation: 'Udaipur',
            jobTitle: 'Associate',
          };
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      setWorkAnniversaries(sortAnniversaries(currentMonthAnniversaries));
      setIsLoading(false);
    } catch (error) {
      console.error("Error occurred", error);
      setError("Failed to load work anniversaries. Please try again later.");
      setIsLoading(false);
    }
  };

  const sortAnniversaries = (anniversaries: IWorkAnniversary[]): IWorkAnniversary[] => {
    return anniversaries.sort((a, b) => {
      const aDate = dayjs(a.employeeHireDate);
      const bDate = dayjs(b.employeeHireDate);
      const now = dayjs();

      // Get day of month for comparison
      const aDay = aDate.date();
      const bDay = bDate.date();
      const currentDay = now.date();

      // Sort by closest to current date
      const aDiff = Math.abs(currentDay - aDay);
      const bDiff = Math.abs(currentDay - bDay);

      return aDiff - bDiff;
    });
  };
  const loadWishedUsers = async (): Promise<void> => {
    try {
      const response = await context.spHttpClient.get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('Wishlist')/items`,
        SPHttpClient.configurations.v1
      );

      if (!response.ok) {
        if (response.status === 404) {
          console.log('Wishlist not found, creating list...');
          await initializeOrCreateList(context, 'Wishlist');
          // Retry fetching the wished users after creating the list
          const retryResponse = await context.spHttpClient.get(
            `${context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('Wishlist')/items`,
            SPHttpClient.configurations.v1
          );
          if (!retryResponse.ok) {
            throw new Error(`Failed to fetch wished users: ${retryResponse.statusText}`);
          }
          const retryData = await retryResponse.json();
          const users = retryData.value.map((item: any) => ({
            sender: item.Sender,
            receiver: item.Receiver,

          }));
          setWishedUsers(users);
        } else {
          throw new Error(`Failed to fetch wished users: ${response.statusText}`);
        }
      } else {
        const data = await response.json();
        const users = data.value.map((item: any) => ({
          sender: item.Sender,
          receiver: item.Receiver,
        }));
        setWishedUsers(users);
      }
    } catch (error) {
      console.error("Error fetching wishes: ", error);
    }
  };

  const sendWish = async (): Promise<void> => {
    if (!selectedUser || !wishMessage) return;

    try {
      const item = {
        __metadata: { type: "SP.Data.WishlistListItem" },
        Title: "Work Anniversary Wish",
        Sender: context.pageContext.user.displayName,
        Receiver: selectedUser.displayName,
        Wish: wishMessage,
      };

      const postWish = async () => {
        await context.spHttpClient.post(
          `${context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('Wishlist')/items`,
          SPHttpClient.configurations.v1,
          {
            headers: {
              Accept: "application/json;odata=nometadata",
              "Content-Type": "application/json;odata=verbose",
              "odata-version": "",
            },
            body: JSON.stringify(item),
          }
        );
      };

      try {
        await postWish();
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log('Wishlist not found, creating list...');
          await initializeOrCreateList(context, 'Wishlist');
          await postWish();
        } else {
          throw error;
        }
      }

      setWishedUsers([
        ...wishedUsers,
        { sender: context.pageContext.user.displayName, receiver: selectedUser.displayName },
      ]);
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      closeWishDialog();
    } catch (error) {
      console.error("Error sending wish: ", error);
    }
  };

  useEffect(() => {
    void getWorkAnniversaries();
    void loadWishedUsers();
  }, []);

  const openWishDialog = (user: IWorkAnniversary): void => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const closeWishDialog = (): void => {
    setIsDialogOpen(false);
    setWishMessage("");
  };

  if (isLoading) {
    return (
      <Box sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: 200,
        bgcolor: "#fff",
        borderRadius: 2,
        p: 3
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{
        p: 3,
        bgcolor: "#f4f6f8",
        borderRadius: 2,
        color: "error.main"
      }}>
        <Typography>{error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      id='anniversaries'
      sx={{
        p: 3,
        bgcolor: "#fff",
        borderRadius: 2,
        color: "inherit",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "40px",

      }}>
      <Box>
        <Typography variant="h4" sx={typographyStyles.heading}>
          Anniversaries
        </Typography>
      </Box>


      <Box sx={{
        flex: 1,
        overflowY: "auto",
        maxHeight: 600,
        "&::-webkit-scrollbar": {
          width: "6px"
        },
        "&::-webkit-scrollbar-track": {
          background: "#f0f0f0",
          borderRadius: "3px"
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#bbb",
          borderRadius: "3px",
          "&:hover": {
            background: "#999"
          }
        },
        pr: 1
      }}>
        {workAnniversaries.length > 0 ? (
          <Stack spacing={2}>
            {workAnniversaries.map((user, index) => {
              const yearsOfService = getYearsOfService(user.employeeHireDate);
              const anniversaryDate = getNextAnniversaryDate(user.employeeHireDate);
              const hasWished = wishedUsers.some(
                (w) => w.sender === context.pageContext.user.displayName && w.receiver === user.displayName
              );

              return (
                <Card
                  key={user.id}
                  sx={{
                    borderRadius: 2,
                    elevation: 5

                  }}
                >
                  <CardContent
                    sx={{
                      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.3)", // Custom shadow
                      "--Paper-shadow": "0px 4px 6px rgba(0, 0, 0, 0.3)", // Override the CSS variable
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2, }}>
                      <Avatar sx={{ bgcolor: "#4B7D2F" }}
                        src={`https://advaiya.sharepoint.com/_layouts/15/userphoto.aspx?accountname=${user.id}`}
                        alt={user.displayName}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                          {user.displayName}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#666" }}>
                          {user.jobTitle}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1 }}>
                        <Chip
                          label={`${yearsOfService} Years`}
                          sx={{
                            bgcolor: "#4B7D2F",
                            color: "white"
                          }}
                        />
                        <Typography variant="caption" sx={{
                          color: "#666",
                          fontWeight: "bold"
                        }}>
                          Work Anniversary on {anniversaryDate}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        📍 {user.officeLocation}
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<Send />}
                        onClick={() => openWishDialog(user)}
                        disabled={hasWished}
                        sx={{
                          bgcolor: hasWished ? "#ccc" : "#4B7D2F",
                          '&:hover': {
                            bgcolor: hasWished ? "#ccc" : "#3A5E24"
                          }
                        }}
                      >
                        {hasWished ? "Wished" : "Send Wish"}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
        ) : (
          <Box sx={{
            textAlign: "center",
            py: 4,
            bgcolor: "#fff",
            borderRadius: 2,
            color: "#666"
          }}>
            <Typography variant="body1">
              No work anniversaries this month
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Check back next month! 🎉
            </Typography>
          </Box>
        )}
      </Box>

      <Dialog
        open={isDialogOpen}
        onClose={closeWishDialog}
        sx={{
          "& .MuiDialog-paper": {
            bgcolor: "#fff",
            color: "inherit",
            width: "360px",
            maxWidth: "90vw",
            overflow: "hidden" // Remove scrollbar
          }
        }}
      >
        <DialogTitle sx={{ color: "#4B7D2F" }}>
          Send Anniversary Wish
        </DialogTitle>
        <DialogContent sx={{ overflow: "hidden", display: "flex", flexDirection: "column" }}> {/* Remove scrollbar */}
          <TextField

            multiline
            rows={3}
            variant="outlined"
            label="Your Wish"
            value={wishMessage}
            onChange={(e) => setWishMessage(e.target.value)}
            sx={{
              mt: 2,
              '& .MuiOutlinedInput-root': {
                color: "inherit",
                '& fieldset': {
                  borderColor: "#666",
                },
                '&:hover fieldset': {
                  borderColor: "#999",
                },
              },
              '& .MuiInputLabel-root': {
                color: "#bbb",
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeWishDialog} sx={{ color: "#bbb" }}>
            Cancel
          </Button>
          <Button
            onClick={() => void sendWish()}
            variant="contained"
            sx={{
              bgcolor: "#4B7D2F",
              '&:hover': {
                bgcolor: "#3A5E24"
              }
            }}
            disabled={!wishMessage.trim()}
          >
            Send Wish
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkAnniversaryComponent;