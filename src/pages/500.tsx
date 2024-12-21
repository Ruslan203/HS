import {GetAppErrorPageProps, getAppErrorPageProps} from "@common/app/error";
import {ErrorPage} from "@common/pages/Error";

export const getStaticProps: GetAppErrorPageProps = getAppErrorPageProps();

export default ErrorPage;
