import styled from "styled-components";

export const IconButton = styled.button`
    display: inline-flex;
    padding: 9px 30px;
    background: none;
    border: 2px solid ${({theme}) => theme.palette.gray};
    border-radius: 8px;
    cursor: pointer;
`;
