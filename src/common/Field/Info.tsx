import styled from "styled-components";

export const FieldInfoList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
`;

export const FieldInfo = styled.div`
    border: 2px solid rgba(36, 30, 12, 0.2);
    border-radius: 8px;
    background: white;
    color: ${({theme}) => theme.palette.black};
    padding: 10px;
    font: normal 16px ${({theme}) => theme.fonts.roboto};
    line-height: 1.3;
`;

export const FieldInfoBold = styled.b`
    color: ${({theme}) => theme.palette.black};
    font: 500 16px ${({theme}) => theme.fonts.roboto};
`;
