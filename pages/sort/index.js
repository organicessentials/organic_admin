import React, { useEffect, useState, useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { showProduct, updateProduct } from "../../service/api/sort";
import { Dropdown } from "primereact/dropdown";
import { index as getCategories } from "../../service/api/category";

const Index = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]); // Initial category state
  const [selectedCategory, setSelectedCategory] = useState(""); // Initial selected category state
  useEffect(() => {
    fetchData();
    getData();
  }, [selectedCategory]); // Fetch data whenever selectedCategory changes

  // const fetchData = async () => {
  //   try {
  //     const data = await showProduct();
  //     if (selectedCategory) {
  //       const filteredRecords = data.filter(
  //         (record) =>
  //           record.category.toLowerCase() ===
  //           selectedCategory?.name.toLowerCase()
  //       );
  //       setProducts(filteredRecords);
  //     } else {
  //       setProducts(data);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  const fetchData = async () => {
    try {
      const data = await showProduct();
      if (selectedCategory) {
        const filteredRecords = data.filter((record) =>
          record.category.some(
            (doc) => doc.name.toLowerCase() === selectedCategory.name.toLowerCase()
          )
        );
        setProducts(filteredRecords);
      } else {
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  

  

  const getData = async () => {
    getCategories().then((data) => setCategory(data));
  };

  const onDragEnd = useCallback(
    (result) => {
      if (!result.destination) return;
      const updatedProducts = [...products];
      const [reorderedItem] = updatedProducts.splice(result.source.index, 1);
      updatedProducts.splice(result.destination.index, 0, reorderedItem);
      // Create an array to send to the backend with the updated order
      const updatedOrderArray = updatedProducts.map((product, index) => ({
        _id: product._id, // Assuming _id is the unique identifier for each product
        orderNumber: index,
      }));
      setProducts(updatedProducts);
      updateProduct({ updatedArray: updatedOrderArray });
    },
    [products]
  );

  return (
    <>
      <div className="card">
        <Dropdown
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          options={category}
          optionLabel="name"
          placeholder="Select a Category"
          className="w-4"
        />
      </div>
      <div className="grid">
        <div className="col-12 md:col-12 lg:col-12">
          <div className="text-center border-round-sm font-bold">
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                padding: "12px",
                background: "gray",
                color:"white"
              }}
            >
              <h style={{ width: "200px", textAlign: "start" }}>Image</h>
              <h
                style={{
                  width: "200px",
                  textAlign: "start",
                  marginLeft: "-119px",
                }}
              >
                Name
              </h>

              <h style={{ width: "200px", textAlign: "start" }}>Categories</h>
              <h style={{ width: "200px", textAlign: "start" }}>Status</h>
            </div>
          </div>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="products">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              <div className="grid">
                {products.map((item, index) => (
                  <div className="col-12 md:col-12 lg:col-12" key={item.id}>
                    <div className="text-center border-round-sm font-bold">
                      <Draggable draggableId={item._id} index={index}>
                        {(provided) => (
                          <>
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-around",
                                  alignItems: "center",
                                  border: "1px solid #ced4da",
                                  padding: "2px",
                                  borderRadius: "12px",
                                  background: "white",
                                }}
                              >
                                {item.image ? (
                                  <img
                                    height={40}
                                    width={40}
                                    src={item.image}
                                    alt="ss"
                                  />
                                ) : (
                                  <img
                                    height={40}
                                    width={40}
                                    src="/product/default.jpg"
                                    className="w-6rem shadow-2 border-round"
                                    alt="Product Image Default"
                                  />
                                )}
                                <h6
                                  style={{ width: "200px", textAlign: "start" }}
                                >
                                  {" "}
                                  {item.name}
                                </h6>
                                <h6
                                  style={{ width: "200px", textAlign: "start" }}
                                >
                                  {item.category
                                    ? `${item.category.map((doc)=>doc.name)}`
                                    : "No Category"}
                                </h6>
                                <h6
                                  style={{ width: "200px", textAlign: "start" }}
                                >
                                  {" "}
                                  {item.status}
                                </h6>
                              </div>
                            </div>
                          </>
                        )}
                      </Draggable>
                    </div>
                  </div>
                ))}
                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};

export default Index;
