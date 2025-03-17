import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  CardMedia,
  Stack,
} from "@mui/material";
import { ISharedComponentProps } from "../../../webparts/landingPage/components/ILandingPageProps";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { initializeOrCreateList } from "../../../helperFunctions/sharePointListHandler"; // Import the function
import { typographyStyles } from "../../../constants/constant";

interface INewsItem {
  id: number;
  Title: string;
  ImageURL: string;
  Description: string;
  References: string;
}

const WhatsNewComponent: React.FC<ISharedComponentProps> = ({ context, isDarkTheme }) => {
  const [newsItems, setNewsItems] = useState<INewsItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cardsToShow = 4;

  const fetchNewsItems = async () => {
    try {
      console.log('Fetching news items...');
      const listUrl = `${context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('whatsNew')/items?$select=Id,Title,ImageURL,Description,References`;

      console.log('API URL:', listUrl);

      const response: SPHttpClientResponse = await context.spHttpClient.get(
        listUrl,
        SPHttpClient.configurations.v1
      );

      if (!response.ok) {
        if (response.status === 404) {
          console.log('List not found, creating list...');
          await initializeOrCreateList(context, 'whatsNew');
          // Retry fetching the news items after creating the list
          const retryResponse: SPHttpClientResponse = await context.spHttpClient.get(
            listUrl,
            SPHttpClient.configurations.v1
          );
          if (!retryResponse.ok) {
            throw new Error(`Failed to fetch news items: ${retryResponse.statusText}`);
          }
          const retryData = await retryResponse.json();
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          processNewsItems(retryData);
        } else {
          throw new Error(`Failed to fetch news items: ${response.statusText}`);
        }
      } else {
        const data = await response.json();
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        processNewsItems(data);
      }
    } catch (err) {
      console.error('Error fetching news items:', err);
      setError('Failed to load news items');
      setIsLoading(false);
    }
  };

  const processNewsItems = (data: any) => {
    console.log('Raw API Response:', data);

    const formattedNews: INewsItem[] = data.value.map((item: any) => {
      console.log('Processing item:', item);
      return {
        id: item.Id,
        Title: item.Title || '',
        ImageURL: item.ImageURL.Description || '',
        Description: item.Description || '',
        References: item.References.Description || '',
      };
    });

    console.log('Formatted News Items:', formattedNews);
    setNewsItems(formattedNews);
    setIsLoading(false);
  };

  useEffect(() => {
    void fetchNewsItems();
  }, [context.pageContext.web.absoluteUrl, context.spHttpClient]);

  const handlePrevious = () => {
    setCurrentIndex((prev: any) =>
      prev === 0 ? newsItems.length - cardsToShow : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev: any) =>
      prev === newsItems.length - cardsToShow ? 0 : prev + 1
    );
  };

  const visibleCards = () => {
    if (newsItems.length === 0) return [];

    const cards = [];
    for (let i = 0; i < cardsToShow; i++) {
      const index = (currentIndex + i) % newsItems.length;
      cards.push(newsItems[index]);
    }
    return cards;
  };

  if (isLoading) {
    return (
      <Box sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: isDarkTheme ? "#fff" : "#666"
      }}>
        Loading...
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#ff4444"
      }}>
        {error}
      </Box>
    );
  }

  return (
    <Box  id="whatsnew" sx={{
      p: 2,
      bgcolor: "fff",
      borderRadius: 3,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      gap: "40px",
     
    }}>
      <Box>
        <Typography variant="h4" sx={typographyStyles.heading}>
          What's New ?
        </Typography>
      </Box>


      <Box sx={{
        display: "flex",
        alignItems: "center",
        flex: 1,
        gap: 2,
        maxWidth: '100%',
        justifyContent: 'center'
      }}>
        <IconButton
          onClick={handlePrevious}
          sx={{
            padding: '10px'
          }}
        >
          <ChevronLeft sx={{
            color: "#104930",
            fontSize: "4.5rem",
          }} />
        </IconButton>

        <Stack
          direction="row"
          spacing={2}
          sx={{
            justifyContent: 'center',
            transition: "transform 0.3s ease-in-out"
          }}
        >
          {visibleCards().map((news) => {
            console.log('Rendering card with data:', news);
            return (
              <Card
                key={news.id}
                sx={{
                  flex: 1,
                  maxWidth: '400px',
                  height: "300px",
                  display: "flex",
                  flexDirection: "column",
                  bgcolor: isDarkTheme ? "#424242" : "#fff",
                  borderRadius: '8px',
                  overflow: 'hidden',
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-2px)',
                    transition: 'all 0.2s ease-in-out'
                  }
                }}
              >
                <CardMedia
                  component="img"
                  image={news.ImageURL}
                  alt={news.Title}
                  sx={{
                    height: "220px",
                    objectFit: "cover",
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    if (news.References) {
                      window.open(news.References, '_blank');
                    }
                  }}
                />
                <CardContent sx={{
                  flex: 1,
                  bgcolor: "#90c168",
                  p: 1,
                  color: 'white'
                }}>
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        mb: 0.5,
                        overflow: 'h6',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        color: "#ffffff",
                      }}
                    >
                      {news.Title}
                    </Typography>
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: '0.8rem',
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      lineHeight: 1.2,
                      color: "#ffffff"
                    }}
                  >
                    {news.Description}
                  </Typography>
                </CardContent>
              </Card>
            );
          })}
        </Stack>

        <IconButton
          onClick={handleNext}
          sx={{
            color: "#90c168",
            '&:hover': {
              bgcolor: isDarkTheme ? "rgba(255,255,255,0.1)" : "rgba(1,150,211,0.1)"
            },
            padding: '10px'
          }}
        >
          <ChevronRight
            sx={{
              color: "#104930",
              fontSize: "4.5rem",
            }}
          />
        </IconButton>
      </Box>
    </Box>
  );
};

export default WhatsNewComponent;