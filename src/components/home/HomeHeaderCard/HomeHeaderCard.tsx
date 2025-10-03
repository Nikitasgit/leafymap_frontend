import Button from "@/components/common/buttons/Button";
import styles from "./HomeHeaderCard.module.scss";
import { getHeaderParameters } from "@/utils/home";
import { UserType } from "../../../types/user/index";
import { useRouter } from "next/navigation";

const HomeHeaderCard = ({
  userType,
  loading,
}: {
  userType: UserType | undefined;
  loading: boolean;
}) => {
  const router = useRouter();
  const headerParameters = getHeaderParameters(userType);

  return (
    <div className={styles.HeaderCard + " " + (loading ? "skeleton" : "")}>
      {!loading && (
        <>
          <h3 className={styles.HeaderCardTitle}>{headerParameters.title}</h3>
          <p className={styles.HeaderCardDescription}>
            {headerParameters.description}
          </p>
          <Button
            ariaLabel={headerParameters.buttonTitle}
            variant="primary"
            size="small"
            onClick={() => {
              router.push(headerParameters.route);
            }}
          >
            {headerParameters.buttonTitle}
          </Button>
        </>
      )}
    </div>
  );
};

export default HomeHeaderCard;
