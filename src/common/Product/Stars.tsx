import React, {useMemo} from "react";
import Image from "next/image";
import styled from "styled-components";
import starBorder from "@common/icons/assets/star-border.svg";
import star from "@common/icons/assets/star.svg";

export const Star = styled(Image)`
    display: inline-flex;
`;

export const ProductStarsStyled = styled.div`
    display: flex;
    gap: 4px;
`;

export const STARS_MAX_COUNT = 5;

export interface ProductStarsProps {
    className?: string;
    stars: number;
}

export const ProductStars: React.FC<ProductStarsProps> = ({className, stars}) => {
    const starsNode = useMemo<React.ReactNode[]>(() => {
        const starsNode: React.ReactNode[] = [];

        if (stars > STARS_MAX_COUNT) {
            stars = STARS_MAX_COUNT;
        }
        for (let starKey = 0; starKey < stars; starKey++) {
            starsNode.push(
                <Star key={starKey} src={star} width={14} height={14} alt="" priority />
            );
        }
        for (let starKey = stars; starKey < STARS_MAX_COUNT; starKey++) {
            starsNode.push(
                <Star key={starKey} src={starBorder} width={14} height={14} alt="" priority />
            );
        }

        return starsNode;
    }, [stars]);

    return <ProductStarsStyled className={className}>{starsNode}</ProductStarsStyled>;
};
