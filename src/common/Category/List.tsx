import React, {useCallback, useContext, useMemo, useRef, useState} from "react";
import styled from "styled-components";
import {css} from "styled-components";
import {motion} from "framer-motion";
import {Button} from "@common/Button";
import {MobileMenuDesktopElement, MobileMenuElement} from "@common/MobileMenu/Element";
import {ArrowDownIcon} from "@common/icons/ArrowDown";

export interface CategoryDesktopListProps {
    $columns: number;
    $collapse: boolean;
}

export const CategoryDesktopList = styled(MobileMenuDesktopElement)<CategoryDesktopListProps>`
    display: grid;
    grid-template-columns: repeat(${({$columns}) => $columns}, 1fr);
    column-gap: 30px;
    width: 100%;
    overflow: hidden;
    ${({$collapse}) =>
        $collapse &&
        css`
            max-height: 300px;
        `}
`;

export const CategoryDesktopListShowAllButton = styled(Button)`
    font-weight: normal;
`;

export const CategoryDesktopListBottomShadow = styled.div`
    display: flex;
    width: 100%;
    height: 30px;
    margin-top: -30px;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.7) 5px, white);
`;

export const CategoryDesktopListContainer = styled(MobileMenuDesktopElement)`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
`;

export interface CategoryMobileListProps {
    $shadowLeft: boolean;
    $shadowRight: boolean;
}

export const CategoryMobileList = styled(MobileMenuElement)<CategoryMobileListProps>`
    display: flex;
    position: fixed;
    height: 50px;
    align-items: center;
    left: 29px;
    right: 29px;
    top: ${({theme}) => theme.header.height};
    @media (max-width: ${({theme}) => theme.mobile.screenMaxWidth}) {
        top: ${({theme}) => theme.header.mobileHeight};
    }
    z-index: ${({theme}) => theme.zIndex.mobileCategories};
    gap: 20px;
    overflow: auto;
    overflow-y: hidden;
    background: ${({theme}) => theme.palette.white};
    padding: 0px 1px;
    ${({$shadowLeft}) =>
        $shadowLeft &&
        css`
            &::before {
                display: inline-flex;
                position: fixed;
                left: 0;
                width: 100px;
                height: 50px;
                background: linear-gradient(90deg, white 30px, white 30px, rgba(0, 0, 0, 0));
                content: "";
            }
        `}
    ${({$shadowRight}) =>
        $shadowRight &&
        css`
            &::after {
                display: inline-flex;
                position: fixed;
                right: 0;
                width: 100px;
                height: 50px;
                background: linear-gradient(-90deg, white 30px, white 30px, rgba(0, 0, 0, 0));
                content: "";
            }
        `}
    &::-webkit-scrollbar {
        width: 3px;
        height: 3px;
    }
    &::-webkit-scrollbar-thumb {
        border-radius: 1.5px;
        background: ${({theme}) => theme.palette.gray};
    }
    @media only screen and (hover: none) and (pointer: coarse) {
        &::-webkit-scrollbar {
            display: none;
        }
    }
`;

export interface CategoryListProps extends React.PropsWithChildren {
    columns?: number;
    mobile?: boolean;
    collapse?: boolean;
    loading?: boolean;
}

export const CategoryList: React.FC<CategoryListProps> = ({
    children,
    columns = 1,
    mobile = false,
    collapse = false,
    loading = false
}) => {
    const listRef = useRef<HTMLDivElement>(null);
    const [shadowLeft, setShadowLeft] = useState(false);
    const [shadowRight, setShadowRight] = useState(true);
    const [showedAll, setShowedAll] = useState(false);

    const itemCount = useMemo<number>(() => React.Children.toArray(children).length, [children]);
    const isCollapseMode = useMemo<boolean>(
        () => collapse && !showedAll && itemCount > 12,
        [collapse, showedAll, itemCount]
    );

    const handleScroll = useCallback(() => {
        const listEl: HTMLDivElement | null = listRef.current;

        if (!listEl) {
            return;
        }

        setShadowLeft(listEl.scrollLeft !== 0);
        setShadowRight(!(listEl.scrollLeft + listEl.clientWidth >= listEl.scrollWidth));
    }, [listRef]);

    const listNode = mobile ? (
        <CategoryMobileList
            as={motion.div}
            animate={{opacity: loading ? 0.4 : 1}}
            ref={listRef}
            $shadowLeft={shadowLeft}
            $shadowRight={shadowRight}
            onScroll={handleScroll}
        >
            {children}
        </CategoryMobileList>
    ) : (
        <CategoryDesktopListContainer as={motion.div} animate={{opacity: loading ? 0.4 : 1}}>
            <CategoryDesktopList as="div" $columns={columns} $collapse={isCollapseMode}>
                {children}
            </CategoryDesktopList>
            {isCollapseMode ? (
                <>
                    <CategoryDesktopListBottomShadow />
                    <CategoryDesktopListShowAllButton
                        variant="text"
                        fullWidth
                        endIcon={<ArrowDownIcon width={16} height={8} />}
                        onClick={setShowedAll.bind(null, true)}
                    >
                        Показать еще
                    </CategoryDesktopListShowAllButton>
                </>
            ) : null}
        </CategoryDesktopListContainer>
    );

    return <CategoryListContext.Provider value={{mobile}}>{listNode}</CategoryListContext.Provider>;
};

export interface ICategoryListContext {
    mobile: boolean;
}

export const CategoryListContext = React.createContext<ICategoryListContext | null>(null);

export function useCategoryList(): ICategoryListContext {
    const context = useContext(CategoryListContext);

    if (!context) {
        throw new Error("useCategoryList must be used within a CategoryList.");
    }

    return context;
}
