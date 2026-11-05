import { TIconsAvailable} from "@types/icons";

export interface IHeaverNavItem {
    label: string;
    href: string;
    icon: TIconsAvailable;
}

export interface IHeaderAroma {
    userName?: string;
    userRole?: string;
    avatarUrl?: string;
}

export interface IRequestParams {
    params: { promise<{id: string;}>;
    };