import React, {useEffect} from "react";
import styled from "styled-components";
import urlJoin from "url-join";
import {Modal, ModalProps} from "@common/Modal";
import {apiUrl} from "@common/config";

export const SdekPointMapWidjet = styled.div`
    width: 100%;
    height: 600px;
    border-radius: 10px;
    overflow: hidden;
    .CDEK-widget__search {
        display: none;
    }
    @media (max-width: ${({theme}) => theme.mobile.screenMaxWidth}) {
        height: 80vh;
        margin-top: 45px;
        border-radius: 0px;
    }
`;

declare const ISDEKWidjet: any; // eslint-disable-line

export interface SdekPointMapModalProps extends ModalProps {
    city?: string;
    onChoose?: (pointCode: string) => unknown;
}

export const SdekPointMapModal: React.FC<SdekPointMapModalProps> = (props) => {
    const {open, city, onChoose} = props;

    useEffect(() => {
        if (open) {
            new ISDEKWidjet({
                defaultCity: city,
                cityFrom: city,
                link: "sdek_widjet",
                path: "https://widget.cdek.ru/widget/scripts/",
                servicepath: urlJoin(apiUrl, "/system/php/scripts/sdek_map.php"),
                hidedress: true,
                hidedelt: true,
                popup: false,
                // eslint-disable-next-line
                onChoose(wat: any) {
                    onChoose?.(wat.id);
                }
            });
        }
    }, [open, city, onChoose]);

    return (
        <Modal {...props} width="1000px" mobileFullScreen mobileDisablePadding>
            <SdekPointMapWidjet id="sdek_widjet" />
        </Modal>
    );
};
