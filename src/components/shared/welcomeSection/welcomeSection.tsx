import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { ISharedComponentProps } from "../../../webparts/landingPage/components/ILandingPageProps";
import { SPHttpClient } from '@microsoft/sp-http';
import { initializeOrCreateList } from "../../../helperFunctions/sharePointListHandler";
import { typographyStyles } from "../../../constants/constant";

interface IPost {
  id: number;
  title: string;
  description: string;
  ImageURL: string;
}

const WelcomeSectionComponent: React.FC<ISharedComponentProps> = ({ context, isDarkTheme }) => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);


  const fetchNewJoiners = async () => {
    try {
      const url = `${context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('newJoinee')/items?$select=Id,Title,Description,ImageURL&$top=3&$orderby=Created desc`;
      console.log('Fetching from URL:', url);

      const response = await context.spHttpClient.get(
        url,
        SPHttpClient.configurations.v1
      );

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        if (response.status === 404) {
          console.log('newJoinee list not found, creating list...');
          await initializeOrCreateList(context, 'newJoinee');
          // Retry fetching the new joiners after creating the list
          const retryResponse = await context.spHttpClient.get(
            url,
            SPHttpClient.configurations.v1
          );
          if (!retryResponse.ok) {
            throw new Error(`Failed to fetch new joiners: ${retryResponse.statusText}`);
          }
          const retryData = await retryResponse.json();
          return retryData.value;
        } else {
          const errorDetails = await response.json();
          console.error('Error details:', errorDetails);
          throw new Error(`Failed to fetch new joiners. Status: ${response.status}`);
        }
      }

      const data = await response.json();
      console.log('Fetched data:', data);
      return data.value;
    } catch (error) {
      console.error('Error fetching new joiners:', error);
      return [];
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const joiners = await fetchNewJoiners();
      const postsData = joiners.map((joiner: any) => ({
        id: joiner.Id,
        title: joiner.Title,
        description: joiner.Description,
        ImageURL: joiner.ImageURL.Description,
      }));
      setPosts(postsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    void (async () => {
      await loadData();
    })();
  }, []);

  if (isLoading) {
    return (
      <Box sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%"
      }}>
        Loading...
      </Box>
    );
  }

  return (
    <Box
      id="welcomes"
      sx={{
        p: 3,
        borderRadius: 2,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "40px",
        height: "88%"
      }}>
      <Box>
        <Typography variant="h4" sx={typographyStyles.heading}>
          Welcomes
        </Typography>
      </Box>


      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        {posts.map(post => (
          <Box
            key={post.id}
            sx={{
              flexBasis: 'calc(33.333% - 24px)',
              maxWidth: '345px',
              '@media (max-width: 900px)': {
                flexBasis: '100%',
                maxWidth: '100%'
              }
            }}
          >
            <Card sx={{ maxWidth: 345, minHeight: 500 }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  {post.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {post.description}
                </Typography>
              </CardContent>
              <Box sx={{ padding: '20px' }}>
                <CardMedia
                  sx={{ height: 300, objectFit: "cover" }}
                  image={post.ImageURL}
                  title={post.title}
                />
              </Box>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default WelcomeSectionComponent;