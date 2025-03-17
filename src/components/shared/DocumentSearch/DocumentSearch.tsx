import React, { useState, useEffect } from 'react';
import {
    Typography,
    Box,
    TextField,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    ListItem,
    List,
    InputAdornment,
    IconButton,
} from "@mui/material";
import FileOpenIcon from '@mui/icons-material/FileOpen';
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { DocumentCategoryColors, typographyStyles } from '../../../constants/constant';
import { initializeOrCreateList } from "../../../helperFunctions/sharePointListHandler";
import { WebPartContext } from '@microsoft/sp-webpart-base';

interface IDocumentCategory {
    Title: string;
    DocumentCategoryIcon: string;
}

interface IDocument {
    FileLeafRef: string;
    FileRef: string;
}

interface IDocumentSearchProps {
    context: WebPartContext;
    spHttpClient: SPHttpClient;
}

const DocumentSearch: React.FC<IDocumentSearchProps> = (props) => {
    const [categories, setCategories] = useState<IDocumentCategory[]>([]);
    const [documents, setDocuments] = useState<IDocument[]>([]);
    const [categoryClicked, setCategoryClicked] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchPerformed, setSearchPerformed] = useState(false);

    const siteUrl = props.context.pageContext.web.absoluteUrl;

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        void fetchDocumentCategories();
    }, []);

    const fetchDocumentCategories = async () => {
        const url = `${siteUrl}/_api/web/lists/getbytitle('OrganizationalDocumentCategory')/items?$select=Title,DocumentCategoryIcon`;

        try {
            const response = await props.spHttpClient.get(url, SPHttpClient.configurations.v1);

            if (!response.ok) {
                if (response.status === 404) {
                    await initializeOrCreateList(props.context, 'OrganizationalDocumentCategory');
                    const retryResponse = await props.spHttpClient.get(url, SPHttpClient.configurations.v1);
                    if (!retryResponse.ok) {
                        throw new Error(`Failed to fetch document categories: ${retryResponse.statusText}`);
                    }
                    const retryData = await retryResponse.json();
                    setCategories(retryData.value);
                } else {
                    throw new Error(`Failed to fetch document categories: ${response.statusText}`);
                }
            } else {
                const data = await response.json();
                setCategories(data.value);
            }
        } catch (error) {
            console.error("Error fetching document categories:", error);
        }
    };

    const fetchDocumentsByCategory = async (category: string) => {
        const url = `${siteUrl}/_api/web/lists/getbytitle('OrganizationalDocuments')/items?$filter=DocumentCategory/Title eq '${category}'&$select=FileLeafRef,FileRef&$orderby=Created desc&$top=10`;

        try {
            const response = await props.spHttpClient.get(url, SPHttpClient.configurations.v1);

            if (!response.ok) {
                if (response.status === 404) {
                    setDocuments([]);
                    setCategoryClicked(true);
                    setSelectedCategory(category);
                } else {
                    throw new Error(`Failed to fetch documents: ${response.statusText}`);
                }
            } else {
                const data = await response.json();
                setDocuments(data.value);
                setCategoryClicked(true);
                setSelectedCategory(category);
            }
        } catch (error) {
            console.error("Error fetching documents:", error);
            setDocuments([]);
            setCategoryClicked(true);
            setSelectedCategory(category);
        }
    };

    const fetchDocumentsBySearchQuery = async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            return;
        }

        const normalizedQuery = searchQuery.replace(/\s+/g, ' ').trim();
        const filterQuery = `substringof('${normalizedQuery}', FileLeafRef)`;
        const url = `${siteUrl}/_api/web/lists/getbytitle('OrganizationalDocuments')/items?$filter=${filterQuery}&$select=FileLeafRef,FileRef`;

        try {
            const response = await props.spHttpClient.get(url, SPHttpClient.configurations.v1);

            if (!response.ok) {
                if (response.status === 404) {
                    setDocuments([]);
                    setCategoryClicked(false);
                    setSearchPerformed(true);
                } else {
                    throw new Error(`Failed to fetch documents: ${response.statusText}`);
                }
            } else {
                const data = await response.json();
                setDocuments(data.value);
                setCategoryClicked(false);
                setSearchPerformed(true);
            }
        } catch (error) {
            console.error("Error fetching documents:", error);
            setDocuments([]);
            setCategoryClicked(false);
            setSearchPerformed(true);
        }
    };

    const clearDocuments = () => {
        setDocuments([]);
        setCategoryClicked(false);
        setSelectedCategory('');
        setSearchQuery('');
        setSearchPerformed(false);
    };

    const heading = categoryClicked ? selectedCategory : searchPerformed ? 'List of Documents' : 'Documents';

    return (
        <Box id="documentsearch" sx={{ padding: 2, display: "flex", flexDirection: "column", gap: 5 }}>
            <Box sx={{ display: "flex" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    {(categoryClicked || searchPerformed) && <ArrowBackIosNewIcon sx={{ color: "#104930" }} onClick={clearDocuments} />}
                </Box>
                <Typography variant="h4" sx={typographyStyles.heading}>
                    {heading}
                </Typography>
            </Box>
            {!categoryClicked && !searchPerformed && (
                <Box>
                    <TextField
                        placeholder="Search Forms & Templates"
                        type="search"
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "50px",
                            },
                            width: "100%",
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => fetchDocumentsBySearchQuery(searchQuery)}>
                                        <SearchIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        autoComplete="off"
                    />
                </Box>
            )}
            {!categoryClicked && !searchPerformed && (
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, padding: 2 }}>
                    {categories.map((category, index) => (
                        <Box
                            key={index}
                            sx={{ padding: '20px', display: "flex", alignItems: "flex-start", justifyContent: "flex-start", gap: "1rem", backgroundColor: DocumentCategoryColors[index % DocumentCategoryColors.length], height: "60px", borderRadius: "10px" }}
                            onClick={() => fetchDocumentsByCategory(category.Title)}
                        >
                            <img src={category.DocumentCategoryIcon} alt={category.Title} width={20} height={20} />
                            <Typography sx={{ color: "white", fontWeight: 700 }}>{category.Title}</Typography>
                        </Box>
                    ))}
                </Box>
            )}

            <Box sx={{ width: '100%' }}>
                <List>
                    {documents.length > 0 ? (
                        documents.map((document, index) => (
                            <ListItem key={index} disablePadding sx={{ bgcolor: index % 2 === 0 ? '#e6f9d4' : '#FFFFFF' }}>
                                <ListItemButton component="a" href={document.FileRef} target="_blank" sx={{ cursor: "pointer" }}>
                                    <ListItemIcon>
                                        <FileOpenIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        <Typography sx={{ textDecoration: "none", textTransform: "uppercase", color: "black" }}>
                                            {document.FileLeafRef}
                                        </Typography>
                                    </ListItemText>
                                </ListItemButton>
                            </ListItem>
                        ))
                    ) : (
                        (searchPerformed || categoryClicked) && (
                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemText primary="No record Found" sx={{ textAlign: "center" }} />
                                </ListItemButton>
                            </ListItem>
                        )
                    )}
                </List>
            </Box>
        </Box>
    );
};

export default DocumentSearch;