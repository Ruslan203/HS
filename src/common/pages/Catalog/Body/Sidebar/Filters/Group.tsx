import React, {useCallback, useMemo, useState} from "react";
import styled from "styled-components";
import {useMobileMenu} from "@common/MobileMenu";
import {Text} from "@common/Text";

export const SidebarFiltersDesktopGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
`;

export const SidebarFiltersDesktopLabel = styled(Text)`
    font: 500 16px ${({theme}) => theme.fonts.roboto};
    color: ${({theme}) => theme.palette.black};
`;

export const SidebarFiltersDesktopList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
`;

export const SidebarFiltersMobileGroup = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
`;

export const SidebarFiltersMobileHead = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30px 0px;
    padding-right: 7px;
    cursor: pointer;
    width: 100%;
`;

export const SidebarFiltersMobileLabel = styled(Text)`
    font: 500 20px ${({theme}) => theme.fonts.roboto};
`;

export const SidebarFiltersMobileArrow = styled.span<{open: boolean}>`
    display: inline-flex;
    width: 9px;
    height: 9px;
    border: 2px solid ${({theme}) => theme.palette.black};
    border-top: transparent;
    border-right: transparent;
    transform: rotate(${({open}) => (open ? "135deg" : "-45deg")});
`;

export const SidebarFiltersMobileList = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
`;

export const SidebarFiltersShowAll = styled.button`
    display: inline-flex;
    border: none;
    background: none;
    padding: 0px;
    font: normal 16px ${({theme}) => theme.fonts.roboto};
    color: ${({theme}) => theme.palette.black};
    cursor: pointer;
    &:hover {
        color: ${({theme}) => theme.palette.red};
    }
`;

export interface SidebarFiltersGroupProps extends React.PropsWithChildren {
    label?: string;
}

export const SidebarFiltersGroup: React.FC<SidebarFiltersGroupProps> = ({label, children}) => {
    const count = React.Children.count(children);
    const [showedAll, setShowedAll] = useState<boolean>(false);
    const {isForMobile} = useMobileMenu();

    const filtersChildren = useMemo<React.ReactNode>(() => {
        const arrayChildren = React.Children.toArray(children);

        if (showedAll) {
            return arrayChildren.sort((childA, childB) => {
                if (React.isValidElement(childA) && React.isValidElement(childB)) {
                    const filterA: unknown = childA.props.children;
                    const filterB: unknown = childB.props.children;

                    if (typeof filterA === "string" && typeof filterB === "string") {
                        const a = filterA.toLowerCase();
                        const b = filterB.toLowerCase();

                        if (a < b) {
                            return -1;
                        } else if (a > b) {
                            return 1;
                        }
                    }
                }

                return 0;
            });
        } else {
            return arrayChildren.slice(0, 5);
        }
    }, [children, showedAll]);

    const toggleAll = useCallback(() => {
        setShowedAll(!showedAll);
    }, [showedAll]);

    if (isForMobile) {
        return (
            <SidebarFiltersMobileGroup>
                <SidebarFiltersMobileHead onClick={toggleAll}>
                    <SidebarFiltersMobileLabel>{label}</SidebarFiltersMobileLabel>
                    <SidebarFiltersMobileArrow open={showedAll} />
                </SidebarFiltersMobileHead>
                {showedAll ? (
                    <SidebarFiltersMobileList>{filtersChildren}</SidebarFiltersMobileList>
                ) : null}
            </SidebarFiltersMobileGroup>
        );
    } else {
        return (
            <SidebarFiltersDesktopGroup>
                {label ? <SidebarFiltersDesktopLabel>{label}</SidebarFiltersDesktopLabel> : null}
                <SidebarFiltersDesktopList>{filtersChildren}</SidebarFiltersDesktopList>
                {!showedAll && count > 5 ? (
                    <SidebarFiltersShowAll onClick={setShowedAll.bind(null, true)}>
                        Показать все
                    </SidebarFiltersShowAll>
                ) : null}
            </SidebarFiltersDesktopGroup>
        );
    }
};
