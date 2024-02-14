import React, { useEffect, useState } from "react";
import User from "../../components/User";
import Order from "../../components/Order";
import { useRouter } from "next/router";
import { show } from "../../service/api/orders";

const Update = () => {
  const router = useRouter();
  const { id } = router.query;
  const [order,setOrder]  = useState([])

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    show(id)
      .then((data) =>setOrder(data))
      .catch((err) => err);
  };

  return (
    <>
      <User order={order} />
      <Order order={order} />
    </>
  );
};

export default Update;

Update.getInitialProps = async () => {
  // You can set the value for pageTitle in getInitialProps
  return { pageTitle: { url: `/orders/:id`, name: "Order Edit" } };
};
