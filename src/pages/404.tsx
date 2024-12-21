import {GetAppNotFoundPageProps, getAppNotFoundPageProps} from "@common/app/not-found";
import {NotFoundPage} from "@common/pages/NotFound";

export const getStaticProps: GetAppNotFoundPageProps = getAppNotFoundPageProps();

export default NotFoundPage;
