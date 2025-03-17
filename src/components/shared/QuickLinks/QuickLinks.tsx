import React, { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { initializeOrCreateList } from "../../../helperFunctions/sharePointListHandler";

interface IQuickLink {
    Title: string;
    QuickLinkIcon: string;
    QuickLinkUrl: string;
}

interface IQuickLinksProps {
    context: WebPartContext;
    spHttpClient: SPHttpClient;
}

const QuickLinks: React.FC<IQuickLinksProps> = (props) => {
    const [quickLinks, setQuickLinks] = useState<IQuickLink[]>([]);
    const siteUrl = props.context.pageContext.web.absoluteUrl;

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        void fetchQuickLinks();
    }, []);

    const fetchQuickLinks = async () => {
        const url = `${siteUrl}/_api/web/lists/getbytitle('QuickLinks')/items?$select=Title,QuickLinkIcon,QuickLinkUrl`;

        try {
            const response = await props.context.spHttpClient.get(url, SPHttpClient.configurations.v1);

            if (!response.ok) {
                if (response.status === 404) {
                    console.log('QuickLinks list not found, creating list...');
                    await initializeOrCreateList(props.context, 'QuickLinks');
                    // Retry fetching the quick links after creating the list
                    const retryResponse = await props.context.spHttpClient.get(url, SPHttpClient.configurations.v1);
                    if (!retryResponse.ok) {
                        throw new Error(`Failed to fetch quick links: ${retryResponse.statusText}`);
                    }
                    const retryData = await retryResponse.json();
                    setQuickLinks(retryData.value);
                } else {
                    throw new Error(`Failed to fetch quick links: ${response.statusText}`);
                }
            } else {
                const data = await response.json();
                setQuickLinks(data.value);
            }
        } catch (error) {
            console.error("Error fetching quick links:", error);
        }
    };

    return (
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(8, 2fr)", gap: 2, padding: 2 }}>
            {quickLinks.map((link, index) => (
                <Box
                    key={index}
                    component="a"
                    href={link.QuickLinkUrl}
                    target="_blank"
                    sx={{
                        padding: '20px',
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "1rem",
                        backgroundColor: "#88bb3e",
                        height: "60px",
                        borderRadius: "10px",
                        textDecoration: "none",
                        cursor: "pointer"
                    }}
                >
                    <img src={link.QuickLinkIcon} alt={link.Title} width={40} height={40} />
                    <Typography sx={{ color: "white", fontWeight: 700 }}>{link.Title}</Typography>
                </Box>
            ))}
        </Box>
    );
};

export default QuickLinks;