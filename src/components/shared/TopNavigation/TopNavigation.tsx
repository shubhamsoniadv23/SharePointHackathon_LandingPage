import * as React from 'react';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { Typography, Box } from '@mui/material';

interface ITopNavigationItem {
    Id: number;
    Title: string;
    PageURL: string | undefined;
    IconURL: string;
    MenuLevel: number;
    Target: string;
    Parent: {
        ID: number;
        Title: string;
    } | undefined;
    AccordionIcon: string;
}

interface ITopNavigationProps {
    context: WebPartContext;
}

const TopNavigation: React.FC<ITopNavigationProps> = (props) => {
    const [anchorEls, setAnchorEls] = useState<{ [key: string]: HTMLElement | null }>({});
    const [navItems, setNavItems] = useState<ITopNavigationItem[]>([]);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        void fetchNavItems();
    }, []);

    const fetchNavItems = async () => {
        const siteUrl = props.context.pageContext.web.absoluteUrl;
        const url = `${siteUrl}/_api/web/lists/getbytitle('LandingPageTopNavigation')/items?$select=Id,Title,PageURL,IconURL,MenuLevel,Target,Parent/ID,Parent/Title,AccordionIcon&$expand=Parent`;

        try {
            const response = await props.context.spHttpClient.get(url, SPHttpClient.configurations.v1);

            if (!response.ok) {
                if (response.status === 404) {
                    console.log('LandingPageTopNavigation list not found, using default items...');
                    const defaultItems: ITopNavigationItem[] = [
                        {
                            Id: 1,
                            Title: "Home",
                            PageURL: "#home",
                            IconURL: "",
                            MenuLevel: 1,
                            Target: "New",
                            Parent: undefined,
                            AccordionIcon: "",
                        },
                        {
                            Id: 2,
                            Title: "Documents",
                            PageURL: "#documentsearch",
                            IconURL: "",
                            MenuLevel: 1,
                            Target: "New",
                            Parent: undefined,
                            AccordionIcon: "",
                        },
                        {
                            Id: 3,
                            Title: "Employee Center",
                            PageURL: undefined,
                            IconURL: "",
                            MenuLevel: 1,
                            Target: "New",
                            Parent: undefined,
                            AccordionIcon: "https://advaiya.sharepoint.com/sites/advportal/TestDeployments/SiteAssets/angle-down-solid.svg",
                        },
                        {
                            Id: 4,
                            Title: "What's New",
                            PageURL: "#whatsnew",
                            IconURL: "",
                            MenuLevel: 1,
                            Target: "New",
                            Parent: undefined,
                            AccordionIcon: "",
                        },
                        {
                            Id: 5,
                            Title: "New Joinees",
                            PageURL: "#welcomes",
                            IconURL: "",
                            MenuLevel: 1,
                            Target: "New",
                            Parent: undefined,
                            AccordionIcon: "",
                        },
                        {
                            Id: 6,
                            Title: "Work Anniversaries",
                            PageURL: "#anniversaries",
                            IconURL: "",
                            MenuLevel: 1,
                            Target: "New",
                            Parent: undefined,
                            AccordionIcon: "",
                        },
                        {
                            Id: 7,
                            Title: "The Hive",
                            PageURL: "https://www.google.com/",
                            IconURL: "",
                            MenuLevel: 2,
                            Target: "New",
                            Parent: { ID: 3, Title: "Employee Center" },
                            AccordionIcon: "",
                        },
                        {
                            Id: 8,
                            Title: "Employee Gateway",
                            PageURL: "https://www.google.com/",
                            IconURL: "",
                            MenuLevel: 2,
                            Target: "New",
                            Parent: { ID: 3, Title: "Employee Center" },
                            AccordionIcon: "",
                        },
                        {
                            Id: 9,
                            Title: "WorkZen",
                            PageURL: "https://www.google.com/",
                            IconURL: "",
                            MenuLevel: 2,
                            Target: "New",
                            Parent: { ID: 3, Title: "Employee Center" },
                            AccordionIcon: "",
                        },
                        {
                            Id: 10,
                            Title: "PulsePoint",
                            PageURL: "https://www.google.com/",
                            IconURL: "",
                            MenuLevel: 2,
                            Target: "New",
                            Parent: { ID: 3, Title: "Employee Gateway" },
                            AccordionIcon: "",
                        },
                        {
                            Id: 11,
                            Title: "Calender",
                            PageURL: "#calendar",
                            IconURL: "",
                            MenuLevel: 1,
                            Target: "Existing",
                            Parent: undefined,
                            AccordionIcon: "",
                        }
                    ];
                    setNavItems(defaultItems);
                } else {
                    throw new Error(`Failed to fetch navigation items: ${response.statusText}`);
                }
            } else {
                const data = await response.json();
                setNavItems(data.value);
                console.log(data);
            }
        } catch (error) {
            console.error("Error fetching navigation items:", error);
        }
    };

    const handleClick = (event: React.MouseEvent<HTMLDivElement>, title: string) => {
        setAnchorEls(prev => ({ ...prev, [title]: event.currentTarget }));
    };

    const handleClose = (title: string) => {
        setAnchorEls(prev => ({ ...prev, [title]: null }));
    };

    const handleRefresh = () => {
        window.location.reload();
    };

    const renderNavItems = (items: ITopNavigationItem[]) => {
        return items.map(item => {
            if (item.MenuLevel === 1) {
                const childItems = items.filter(child => child.MenuLevel === 2 && child.Parent?.ID === item.Id);
                return (
                    <div key={item.Title}>
                        <Box
                            sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}
                            onClick={(event) => handleClick(event, item.Title)}
                        >
                            <Button
                                id={`button-${item.Title}`}
                                aria-controls={anchorEls[item.Title] ? `menu-${item.Title}` : undefined}
                                aria-haspopup="true"
                                aria-expanded={anchorEls[item.Title] ? 'true' : undefined}
                                sx={{ color: 'black' }}
                                component="a"
                                href={item.PageURL}
                            // target={item.Target === 'New' ? '_blank' : '_self'}
                            >
                                {item.Title}
                            </Button>
                            {childItems.length > 0 && (
                                <img
                                    src={item.AccordionIcon}
                                    alt={`${item.Title} icon`}
                                    width={20} height={20}
                                />
                            )}
                        </Box>

                        {childItems.length > 0 && (
                            <Menu
                                id={`menu-${item.Title}`}
                                anchorEl={anchorEls[item.Title]}
                                open={Boolean(anchorEls[item.Title])}
                                onClose={() => handleClose(item.Title)}
                            >
                                {childItems.map(child => (
                                    <MenuItem
                                        key={child.Title}
                                        onClick={() => handleClose(item.Title)}
                                        component="a"
                                        href={child.PageURL}
                                        target={child.Target === 'New' ? '_blank' : '_self'}
                                        sx={{ color: 'black' }}
                                    >
                                        {child.Title}
                                    </MenuItem>
                                ))}
                            </Menu>
                        )}
                    </div>
                );
            } else if (item.MenuLevel === 2) {
                return null; // MenuLevel 2 items are handled within MenuLevel 1 items
            }
            return null;
        });
    };

    return (
        <Box sx={{ display: 'flex', gap: 5 }} >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 20px', gap: 2, cursor: 'pointer' }}
                onClick={handleRefresh}>
                <Box>
                    <img src="https://advaiya.sharepoint.com/:i:/r/sites/SS-LearningManagement/Shared%20Documents/General/Artboard%202%208.png?csf=1&web=1&e=uFHqnM" alt="Logo" width={40} height={40} />
                </Box>
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', cursor: 'pointer' }}>
                        ADVAIYA
                    </Typography>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                {renderNavItems(navItems)}
            </Box>
        </Box>
    );
};

export default TopNavigation;