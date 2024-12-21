import {ProfilePage} from "@common/pages/Profile";
import {
    GetProfileServerSideProps,
    getProfileServerSideProps
} from "@common/pages/Profile/getServerSideProps";

export const getServerSideProps: GetProfileServerSideProps = getProfileServerSideProps;

export default ProfilePage;
