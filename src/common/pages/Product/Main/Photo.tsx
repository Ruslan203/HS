import React, {useCallback, useEffect, useRef, useState} from "react";
import Image from "next/image";
import styled, {css} from "styled-components";
import {Fancybox} from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import {motion} from "framer-motion";
import {useApi} from "@common/api";
import {useProduct} from "../Context";

export const ProductPhotoStyled = styled(motion.div)`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    width: 370px;
    @media (max-width: 500px) {
        width: 100%;
    }
`;

export const PhotoImage = styled(Image)`
    display: flex;
    flex-shrink: 0;
    cursor: pointer;
    object-fit: contain;
`;

export const ImageContainer = styled(motion.div)`
    display: inline-flex;
    position: relative;
    width: 370px;
    height: 370px;
    flex-shrink: 0;
    @media (max-width: 500px) {
        width: 100%;
    }
`;

export const NotFoundImage = styled(ImageContainer)`
    background: white;
    cursor: not-allowed;
`;

export const ImagePreviews = styled.div`
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    align-items: center;
    min-height: 56px;
`;

export const ImagePreviewContainer = styled.div<{current?: boolean}>`
    display: inline-flex;
    border-radius: 8px;
    overflow: hidden;
    ${({theme, current}) =>
        current
            ? css`
                  border: 2px solid ${theme.palette.black};
                  cursor: default;
              `
            : css`
                  border: 1px solid ${theme.palette.dividers};
                  cursor: pointer;
              `}
`;

export const ImagePreview = styled(Image)`
    object-fit: contain;
`;

export const ProductPhoto: React.FC = () => {
    const api = useApi();
    const {name, image, setImage, images} = useProduct();

    const [imageError, setImageError] = useState<boolean>(false);
    const [imageLoaded, setImageLoaded] = useState<boolean>(true);
    const isImageMounted = useRef(false);
    useEffect(() => {
        if (isImageMounted.current) {
            setImageLoaded(false);
            setImageError(false);
        } else {
            isImageMounted.current = true;
        }
    }, [image]);

    const handlePhotoClick = useCallback(() => {
        let startIndex = 0;
        if (image !== null) {
            for (let index = 0; index < images.length; index++) {
                if (images[index].id === image.id) {
                    startIndex = index;
                    continue;
                }
            }
        }

        Fancybox.show(
            images.map((image) => ({
                src: api.url(image.picture),
                thumb: api.url(image.photo370)
            })),
            {
                startIndex
            }
        );
    }, [api, images, image]);

    return (
        <ProductPhotoStyled>
            {image && !imageError ? (
                <ImageContainer
                    animate={{opacity: imageLoaded ? 1 : 0.4}}
                    onClick={handlePhotoClick}
                >
                    <PhotoImage
                        src={api.url(image.photo370 ?? image.picture ?? image.pic)}
                        alt={name}
                        title={name}
                        fill
                        unoptimized
                        priority
                        onLoadStart={setImageLoaded.bind(null, false)}
                        onError={setImageError.bind(null, true)}
                        onLoad={setImageLoaded.bind(null, true)}
                    />
                </ImageContainer>
            ) : (
                <NotFoundImage as="div" title="У этого товара нет изображения!" />
            )}
            {images.length !== 0 ? (
                <ImagePreviews>
                    {images.map((imageItem) => {
                        const {id, photo56} = imageItem;
                        const current = image ? id === image.id : false;

                        if (!image || !photo56) {
                            return null;
                        }

                        return (
                            <ImagePreviewContainer
                                key={id}
                                current={current}
                                data-fancybox
                                onClick={setImage.bind(null, imageItem)}
                            >
                                <ImagePreview
                                    src={api.url(photo56)}
                                    alt={name}
                                    title={name}
                                    width={56}
                                    height={56}
                                    priority
                                    onError={setImageError.bind(null, true)}
                                />
                            </ImagePreviewContainer>
                        );
                    })}
                </ImagePreviews>
            ) : null}
        </ProductPhotoStyled>
    );
};
