import {
    GetProductServerSideProps,
    ProductPage,
    getProductServerSideProps
} from "@common/pages/Product";

export const getServerSideProps: GetProductServerSideProps = getProductServerSideProps;

export default ProductPage;
