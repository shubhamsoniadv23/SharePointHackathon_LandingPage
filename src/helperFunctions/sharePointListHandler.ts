// SharePointListHandler.ts
import { spfi, SPFx as spSPFx, SPFI } from "@pnp/sp";
import { IFieldInfo, FieldTypes } from "@pnp/sp/fields";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/fields";
import { IList } from "@pnp/sp/lists";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import {
  TopNavListColumns,
} from "../constants/constant";

export interface INavigationItem {
  Title: string;

  // CustomText?: string;

  // LookupReference?: number;
  MultiText?: string;
  PageURL?: string; // Add PageURL property
  IconURL?: string; // Add IconURL property
  MenuLevel?: number; // Add MenuLevel property
  Target?: string; // Add Target property
  Parent?: {
    Id: number;
    Title: string;
  } | undefined; // Add Parent property
  AccordionIcon?: string; // Add AccordionIcon property
}

export interface IColumnDefinition {
  name: string;
  type: FieldTypes;
  required: boolean;
  additionalProperties?: Record<string, unknown>;
  lookupListName?: string;
  lookupField?: string;
}

export async function initializeOrCreateList(
  context: WebPartContext,
  listName: string
): Promise<IList> {
  const sp: SPFI = spfi().using(spSPFx(context));
  try {
    console.log(`Looking for list: ${listName}`);
    const list = sp.web.lists.getByTitle(listName);
    await list.select("Title")();
    console.log(`List "${listName}" found successfully`);
    return list;
  } catch (error) {
    console.log("Error fetching list:", error);
    console.log(`List "${listName}" not found. Creating new list...`);

    const lookupList = await createLookupList(context);

    let columns: IColumnDefinition[] = [];

    switch (listName) {
      case "Wishlist":
        columns = [
          { name: "Sender", type: FieldTypes.Text, required: true },
          { name: "Receiver", type: FieldTypes.Text, required: true },
          { name: "Wish", type: FieldTypes.Text, required: true },
        ];
        break;
      case "whatsNew":
        columns = [
          { name: "Description", type: FieldTypes.Text, required: true },
          { name: "ImageURL", type: FieldTypes.URL, required: true },
          { name: "References", type: FieldTypes.URL, required: true },
        ];
        break;
      case "newJoinee":
        columns = [
          { name: "Description", type: FieldTypes.Text, required: true },
          { name: "ImageURL", type: FieldTypes.URL, required: true },
        ];
        break;
      case "QuickLinks":
        columns = [
          { name: "QuickLinkIcon", type: FieldTypes.Text, required: true },
          { name: "QuickLinkUrl", type: FieldTypes.Text, required: true },
        ];
        break;
      case "OrganizationalDocumentCategory":
        columns = [
          { name: "DocumentCategoryIcon", type: FieldTypes.Text, required: true },
        ];
        break;
      default:
        columns = [
          // {
          //   name: "LookupReference",
          //   type: FieldTypes.Lookup,
          //   required: false,
          //   lookupListName: lookupList.fields.bind("Title")(),
          //   lookupField: "ID",
          // },
          {
            name: "MultiText",
            type: FieldTypes.Note,
            required: false,
            additionalProperties: { NumberOfLines: 5 },
          },
          { name: "PageURL", type: FieldTypes.URL, required: false }, // Add PageURL column
          { name: "IconURL", type: FieldTypes.URL, required: false }, // Add IconURL column
          { name: "MenuLevel", type: FieldTypes.Number, required: false }, // Add MenuLevel column
          { name: "Target", type: FieldTypes.Text, required: false }, // Add Target column
          // { name: "Parent", type: FieldTypes.Lookup, required: false, lookupListName: listName, lookupField: "ID" }, // Add Parent column
          { name: "AccordionIcon", type: FieldTypes.URL, required: false }, // Add AccordionIcon column

        ];
        break;
    }

    const createListResult = await sp.web.lists.add(
      listName,
      `${listName} created by SPFx web part`,
      100,
      true
    );

    const list = sp.web.lists.getByTitle(listName);
    await addColumnsToList(list, columns, context);
    // Call the appropriate function based on the list name
    switch (listName) {
      case "Wishlist":
        await createWishListItems(context, list);
        break;
      case "whatsNew":
        await createWhatsNewItems(context, list);
        break;
      case "newJoinee":
        await createNewJoineeItems(context, list);
        break;
      case "QuickLinks":
        await createQuickLinksItems(context, list);
        break;
      case "OrganizationalDocumentCategory":
        await createOrganizationalDocumentCategoryItems(context, list);
        break;
      default:
        await createMultipleNavigationItems(context, listName, []);
        break;
    }
    return list;
  }
}

export async function addColumnsToList(
  list: IList,
  columns: IColumnDefinition[],
  context: WebPartContext
): Promise<void> {
  for (const column of columns) {
    try {
      switch (column.type) {
        case FieldTypes.Text:
          await list.fields.addText(column.name);
          break;
        case FieldTypes.User:
          await list.fields.addUser(column.name, { Required: column.required });
          break;
        case FieldTypes.Lookup:
          await list.fields.addLookup(column.name, {
            LookupListId: await getLookupListId(
              context,
              column.lookupListName!
            ),
            LookupFieldName: column.lookupField!,
          });
          break;
        case FieldTypes.Note:
          await list.fields.addMultilineText(
            column.name,
            column.additionalProperties || {}
          );
          break;
        case FieldTypes.URL:
          await list.fields.addUrl(column.name);
          break;
        case FieldTypes.Number: // Add case for FieldTypes.Number
          await list.fields.addNumber(column.name, { Required: column.required });
          break;
      }
      console.log(`Successfully added column: ${column.name}`);
    } catch (error) {
      console.error(`Error adding column ${column.name}:`, error);
    }
  }
}

async function createLookupList(context: WebPartContext): Promise<IList> {
  const sp: SPFI = spfi().using(spSPFx(context));
  const listName = "LookupList";
  try {
    const list = sp.web.lists.getByTitle(listName);
    await list.select("Title")();
    console.log(`Lookup list "${listName}" found.`);
    return list;
  } catch {
    console.log(`Creating lookup list "${listName}"...`);
    const result = await sp.web.lists.add(
      listName,
      "Lookup list for reference",
      100,
      true
    );
    return sp.web.lists.getByTitle(listName);
  }
}

async function getLookupListId(
  context: WebPartContext,
  listName: string
): Promise<string> {
  const sp: SPFI = spfi().using(spSPFx(context));
  const list = sp.web.lists.getByTitle(listName);
  const listData = await list.select("Id")();
  return listData.Id;
}
export async function createMultipleNavigationItems(
  context: WebPartContext,
  listName: string,
  items: INavigationItem[]
): Promise<number[]> {
  try {
    // Initialize PnPjs with SPFx context
    const sp: SPFI = spfi().using(spSPFx(context));
    const list = sp.web.lists.getByTitle(listName);

    console.log(`Creating ${items.length} navigation items in list: ${listName}`);

    const createdItemIds: number[] = [];

    // Define default items for LandingPageTopNavigation
    const defaultItems: INavigationItem[] = [
      {

        // LookupReference: undefined,
        MultiText: "",
        Title: "Home",
        PageURL: "#home",
        IconURL: "",
        MenuLevel: 1,
        Target: "New",
        Parent: undefined,
        AccordionIcon: "",
      },
      {

        // LookupReference: undefined,
        MultiText: "",
        Title: "Documents",
        PageURL: "#documentsearch",
        IconURL: "",
        MenuLevel: 1,
        Target: "New",
        Parent: undefined,
        AccordionIcon: "",
      },
      {

        // LookupReference: undefined,
        MultiText: "",
        Title: "",
        PageURL: "",
        IconURL: "",
        MenuLevel: 1,
        Target: "5",
        Parent: undefined,
        AccordionIcon: "",
      },
      {

        // LookupReference: undefined,
        MultiText: "",
        Title: "Employee Center",
        PageURL: "",
        IconURL: "",
        MenuLevel: 1,
        Target: "New",
        Parent: undefined,
        AccordionIcon: "https://advaiya.sharepoint.com/sites/advportal/TestDeployments/SiteAssets/angle-down-solid.svg",
      },
      {

        // LookupReference: undefined,
        MultiText: "",
        Title: "What's New",
        PageURL: "#whatsnew",
        IconURL: "",
        MenuLevel: 1,
        Target: "New",
        Parent: undefined,
        AccordionIcon: "",
      },
      {

        // LookupReference: undefined,
        MultiText: "",
        Title: "New Joinees",
        PageURL: "#welcomes",
        IconURL: "",
        MenuLevel: 1,
        Target: "New",
        Parent: undefined,
        AccordionIcon: "",
      },
      {

        // LookupReference: undefined,
        MultiText: "",
        Title: "Work Anniversaries",
        PageURL: "#anniversaries",
        IconURL: "",
        MenuLevel: 1,
        Target: "New",
        Parent: undefined,
        AccordionIcon: "",
      }
      ,
      {

        // LookupReference: undefined,
        MultiText: "",
        Title: "The Hive",
        PageURL: "https://www.google.com/",
        IconURL: "",
        MenuLevel: 2,
        Target: "New",
        // Parent: {Id:3,Title:"Employee Gateway"},
        Parent: undefined,
        AccordionIcon: "",
      },
      {

        // LookupReference: undefined,
        MultiText: "",
        Title: "Employee Gateway",
        PageURL: "https://www.google.com/",
        IconURL: "",
        MenuLevel: 2,
        Target: "New",
        // Parent: {Id:3,Title:"Employee Gateway"},
        Parent: undefined,
        AccordionIcon: "",
      },
      {

        // LookupReference: undefined,
        MultiText: "",
        Title: "WorkZen",
        PageURL: "https://www.google.com/",
        IconURL: "",
        MenuLevel: 2,
        Target: "New",
        // Parent:{Id:3,Title:"Employee Gateway"},
        Parent: undefined,
        AccordionIcon: "",
      }
      ,
      {

        // LookupReference: undefined,
        MultiText: "",
        Title: "PulsePoint",
        PageURL: "https://www.google.com/",
        IconURL: "",
        MenuLevel: 2,
        Target: "New",
        Parent: undefined,
        AccordionIcon: "",
      },
      {

        // LookupReference: undefined,
        MultiText: "",
        Title: "Calender",
        PageURL: "#calendar",
        IconURL: "",
        MenuLevel: 1,
        Target: "Existing",
        Parent: undefined,
        AccordionIcon: "",
      }

      // Add more default items as needed
    ];

    // Use default items if no items are provided
    const itemsToAdd = items.length > 0 ? items : defaultItems;

    // Process items in sequence to ensure proper error handling
    for (const item of itemsToAdd) {
      // Format the item for SharePoint
      const formattedItem: Record<string, any> = {
        Title: item.Title,
        MultiText: item.MultiText,
        PageURL: item.PageURL,
        IconURL: item.IconURL,
        MenuLevel: item.MenuLevel,
        Target: item.Target,
        ParentId: item.Parent?.Id,
        AccordionIcon: item.AccordionIcon,
      };
      // Add the item to the list
      const result = await list.items.add(formattedItem);
      // Store the created item's ID
      createdItemIds.push(result.data.Id);
    }

    console.log(`Created ${createdItemIds.length} navigation items successfully`);
    return createdItemIds;
  } catch (error) {
    alert(error);
    console.error("Error in createMultipleNavigationItems:", error);
    throw error;
  }
}

// Function to create WishList items
async function createWishListItems(context: WebPartContext, list: IList): Promise<void> {
  const items = [
    { __metadata: { type: "SP.Data.WishlistListItem" }, Title: "Wish 1", Sender: "Sender 1", Receiver: "Receiver 1", Wish: "Happy Anniversary!" },
    { __metadata: { type: "SP.Data.WishlistListItem" }, Title: "Wish 2", Sender: "Sender 2", Receiver: "Receiver 2", Wish: "Congratulations!" },
    { __metadata: { type: "SP.Data.WishlistListItem" }, Title: "Wish 3", Sender: "Sender 3", Receiver: "Receiver 3", Wish: "Congratulations!" },
    { __metadata: { type: "SP.Data.WishlistListItem" }, Title: "Wish 4", Sender: "Sender 4", Receiver: "Receiver 4", Wish: "Congratulations!" },
  ];
  for (const item of items) {
    await list.items.add(item);
  }
}

// Function to create whatsNew items
async function createWhatsNewItems(context: WebPartContext, list: IList): Promise<void> {
  const items = [
    {
      Title: "Artificial Intelligence",
      Description: "The intelligence exhibited by machines is termed Artificial Intelligence (AI). 2) It induces the capability to think and learn in the machines",
      ImageURL: { Url: "https://th.bing.com/th/id/OIP.Ing_VuqlFhPh9RjsHJEGHgHaH_?pid=ImgDet&w=206&h=222&c=7&dpr=1.3", Description: "https://th.bing.com/th/id/OIP.Ing_VuqlFhPh9RjsHJEGHgHaH_?pid=ImgDet&w=206&h=222&c=7&dpr=1.3" },
      References: { Url: "https://www.google.com/", Description: "https://www.google.com/" }
    },
    {
      Title: "SDLC",
      Description: "SDLC is a process followed for software building within a software organization. SDLC consists of a precise plan that describes how to develop, maintain, replace, and enhance specific software. ",
      ImageURL: { Url: "https://i0.wp.com/blog.hubspot.com/hubfs/Growth%20Strategies-png.png?ssl=1", Description: "https://i0.wp.com/blog.hubspot.com/hubfs/Growth%20Strategies-png.png?ssl=1" },
      References: { Url: "https://www.google.com/", Description: "https://www.google.com/" }
    },
    {
      Title: "SharePoint",
      Description: "SharePoint is a product that lets you create websites to store, organize, share, and access information.",
      ImageURL: { Url: "https://wp.guru.com/blog/wp-content/uploads/2023/07/what-does-a-sharepoint-developer-do.jpg", Description: "https://wp.guru.com/blog/wp-content/uploads/2023/07/what-does-a-sharepoint-developer-do.jpg" },
      References: { Url: "https://www.google.com/", Description: "https://www.google.com/" }
    },
    {
      Title: "Microsoft AI ",
      Description: "The Microsoft AI platform provides a suite of powerful tools, such as the Bot Framework, Cognitive Services, Azure Machine Learning etc.",
      ImageURL: { Url: "https://startup-buzz.com/wp-content/uploads/2016/12/microsoft.jpg", Description: "https://startup-buzz.com/wp-content/uploads/2016/12/microsoft.jpg" },
      References: { Url: "https://www.google.com/", Description: "https://www.google.com/" }
    },
  ];
  for (const item of items) {
    try {
      await list.items.add(item);
      console.log(`Successfully added item: ${item.Title}`);
    } catch (error) {
      console.error(`Error adding item ${item.Title}:`, error);
    }
  }
}

// Function to create newJoinee items
async function createNewJoineeItems(context: WebPartContext, list: IList): Promise<void> {
  const items = [
    { Title: "Yashvardhan Singh Hada", Description: "He join our team as a Software Engineer on 1st March 2025, and he is a great asset to our team.", ImageURL: { Url: "https://media.licdn.com/dms/image/v2/D4D03AQFapuruE09BcA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1727709736125?e=2147483647&v=beta&t=mnoS-5W3zMKkBJS9B791YgyqkYT1qq0j_9LP6hz7nww", Description: "https://media.licdn.com/dms/image/v2/D4D03AQFapuruE09BcA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1727709736125?e=2147483647&v=beta&t=mnoS-5W3zMKkBJS9B791YgyqkYT1qq0j_9LP6hz7nww" } },
    { Title: "Devashish Sharma", Description: "He join our team as a Software Engineer on 1st March 2025, and he is a great asset to our team.", ImageURL: { Url: "https://media.licdn.com/dms/image/v2/D5603AQH1qrJVFBwJQw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1716374444772?e=2147483647&v=beta&t=mSHL5VVsJyVaCROWTzIHwAe8wj8cfxx0AKqyHEUEuWw", Description: "https://media.licdn.com/dms/image/v2/D5603AQH1qrJVFBwJQw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1716374444772?e=2147483647&v=beta&t=mSHL5VVsJyVaCROWTzIHwAe8wj8cfxx0AKqyHEUEuWw" } },
    { Title: "Bhrigu Soni", Description: "He join our team as an AI/ML Engineer on 1st March 2025, and he is a great asset to our team.", ImageURL: { Url: "https://media.licdn.com/dms/image/v2/D4D03AQEGTaI-ZK_1Ag/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1718213336179?e=2147483647&v=beta&t=t8gXGAmxeQ7b83XlaSEYoYDfCDWJjM95Uh8ZNDwlYAc", Description: "https://media.licdn.com/dms/image/v2/D4D03AQEGTaI-ZK_1Ag/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1718213336179?e=2147483647&v=beta&t=t8gXGAmxeQ7b83XlaSEYoYDfCDWJjM95Uh8ZNDwlYAc" } },
  ];
  for (const item of items) {
    await list.items.add(item);
  }
}

// Function to create QuickLinks items
async function createQuickLinksItems(context: WebPartContext, list: IList): Promise<void> {
  const items = [
    { Title: "TimeSheets", QuickLinkIcon: "https://advaiya.sharepoint.com/sites/advportal/TestDeployments/SiteAssets/QuickLinksAssests/timer-svgrepo-com.svg", QuickLinkUrl: "https://www.google.com/" },
    { Title: "Time Off", QuickLinkIcon: "https://advaiya.sharepoint.com/sites/advportal/TestDeployments/SiteAssets/QuickLinksAssests/carry-bag-7-svgrepo-com.svg", QuickLinkUrl: "https://www.google.com/" },
    { Title: "Expenses", QuickLinkIcon: "https://advaiya.sharepoint.com/sites/advportal/TestDeployments/SiteAssets/QuickLinksAssests/calendar-svgrepo-com.svg", QuickLinkUrl: "https://www.google.com/" },
    { Title: "Holidays", QuickLinkIcon: "https://advaiya.sharepoint.com/sites/advportal/TestDeployments/SiteAssets/QuickLinksAssests/calendar-svgrepo-com.svg", QuickLinkUrl: "https://www.google.com/" },
    { Title: "Benefits", QuickLinkIcon: "https://advaiya.sharepoint.com/sites/advportal/TestDeployments/SiteAssets/QuickLinksAssests/doctor-bag-svgrepo-com.svg", QuickLinkUrl: "https://www.google.com/" },
    { Title: "Directory", QuickLinkIcon: "https://advaiya.sharepoint.com/sites/advportal/TestDeployments/SiteAssets/QuickLinksAssests/organization-hierarchy-svgrepo-com.svg", QuickLinkUrl: "https://www.google.com/" },
    { Title: "IT Helpdesk", QuickLinkIcon: "https://advaiya.sharepoint.com/sites/advportal/TestDeployments/SiteAssets/QuickLinksAssests/laptop-svgrepo-com.svg", QuickLinkUrl: "https://www.google.com/" },
    { Title: "Products", QuickLinkIcon: "https://advaiya.sharepoint.com/sites/advportal/TestDeployments/SiteAssets/QuickLinksAssests/box-open-svgrepo-com.svg", QuickLinkUrl: "https://www.google.com/" },
  ];
  for (const item of items) {
    await list.items.add(item);
  }
}

// Function to create OrganizationalDocumentCategory items
async function createOrganizationalDocumentCategoryItems(context: WebPartContext, list: IList): Promise<void> {
  const items = [
    { Title: "Request Forms", DocumentCategoryIcon: "https://advaiya.sharepoint.com/sites/advportal/TestDeployments/SiteAssets/OrganizationalDocumentCategoryAssests/pencil-svgrepo-com.svg" },
    { Title: "Applications", DocumentCategoryIcon: "https://advaiya.sharepoint.com/sites/advportal/TestDeployments/SiteAssets/OrganizationalDocumentCategoryAssests/sparkles-svgrepo-com.svg" },
    { Title: "Templates", DocumentCategoryIcon: "https://advaiya.sharepoint.com/sites/advportal/TestDeployments/SiteAssets/OrganizationalDocumentCategoryAssests/gallery-svgrepo-com.svg" },
    { Title: "Projects", DocumentCategoryIcon: "https://advaiya.sharepoint.com/sites/advportal/TestDeployments/SiteAssets/OrganizationalDocumentCategoryAssests/bulb-invention-svgrepo-com.svg" },
    { Title: "Employee Handbook", DocumentCategoryIcon: "https://advaiya.sharepoint.com/sites/advportal/TestDeployments/SiteAssets/OrganizationalDocumentCategoryAssests/notepad-svgrepo-com.svg" },
    { Title: "Policies and Procedures", DocumentCategoryIcon: "https://advaiya.sharepoint.com/sites/advportal/TestDeployments/SiteAssets/OrganizationalDocumentCategoryAssests/file-3-svgrepo-com.svg" },
    { Title: "Marketing Collateral", DocumentCategoryIcon: "https://advaiya.sharepoint.com/sites/advportal/TestDeployments/SiteAssets/OrganizationalDocumentCategoryAssests/notepad-note-svgrepo-com.svg" },
    { Title: "SOPs", DocumentCategoryIcon: "https://advaiya.sharepoint.com/sites/advportal/TestDeployments/SiteAssets/OrganizationalDocumentCategoryAssests/compass-svgrepo-com.svg" },
  ];
  for (const item of items) {
    await list.items.add(item);
  }
}