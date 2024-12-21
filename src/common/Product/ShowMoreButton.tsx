import styled from "styled-components";
import {Button} from "@common/Button";

export const ProductShowMoreButton = styled(Button).attrs((props) => ({
    ...props,
    children: "Показать еще"
}))`
    width: 100%;
    margin-top: 24px;
`;
