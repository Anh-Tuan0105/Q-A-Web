export interface PopularTag {
    _id: string;
    name: string;
    totalQuestion: number;
}

export interface PopularTagsResponse {
    success: boolean;
    tags: PopularTag[];
}

export interface Tag {
    _id: string;
    name: string;
    description: string;
    totalQuestion: number;
    followers: number;
    viewCount: number;
}

export interface PaginatedTagsResponse {
    success: boolean;
    tags: Tag[];
    currentPage: number;
    totalPages: number;
    totalTags: number;
}

