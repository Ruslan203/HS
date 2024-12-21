import React from "react";
import Image from "next/image";
import styled from "styled-components";
import {Link} from "@common/Link";
import arrowLeftIcon from "./assets/arrow-left-icon.svg";

export const ArrowLeftIcon = styled(Image)`
    display: inline-flex;
`;

export const BackLinkStyled = styled(Link)`
    display: inline-flex;
    align-items: center;
    gap: 16px;
    color: #a7a59e;
    font: 500 16px ${({theme}) => theme.fonts.roboto};
    margin-top: 5px;
`;

export interface BackLinkProps extends React.PropsWithChildren {
    className?: string;
    href: string;
}

export const BackLink: React.FC<BackLinkProps> = ({className, href, children}) => (
    <BackLinkStyled className={className} href={href}>
        <ArrowLeftIcon
            src={arrowLeftIcon}
            width={9}
            height={14}
            alt="Иконка обратной ссылки"
            priority
        />
        {children}
    </BackLinkStyled>
);
