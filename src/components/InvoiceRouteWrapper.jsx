import { useParams } from "react-router-dom";
import Invoice from "./Invoice";

const InvoiceRouteWrapper = ({ openModal, setOpenModal }) => {
  const { tranId } = useParams();

  return (
    <Invoice
      openModal={openModal}
      setOpenModal={setOpenModal}
      tranId={tranId}
    />
  );
};
export default InvoiceRouteWrapper;
