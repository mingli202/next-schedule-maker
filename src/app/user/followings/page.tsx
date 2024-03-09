import { faFrown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Page = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <p className="max-w-2xl shrink-0 text-center">In progress...</p>
      <FontAwesomeIcon icon={faFrown} />
    </div>
  );
};

export default Page;
