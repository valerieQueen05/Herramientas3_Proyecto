import type { LucideIcon } from "lucide-react";

export interface IHeaderNavItem {
    label: string;
    href: string;
    icon: LucideIcon;
}

export interface IHeaderAroma {
    userName?: string;
    userRole?: string;
    avatarUrl?: string;
}

// En Next.js 15+ los params de una ruta dinámica llegan como una Promise
export interface IRequestParams {
    params: Promise<{ id: string }>;
}
