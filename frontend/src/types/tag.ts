export interface PopularTag {
    _id: string;
    name: string;
    totalQuestion: number;
}

export interface PopularTagsResponse {
    success: boolean;
    tags: PopularTag[];
}

