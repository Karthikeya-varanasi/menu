
'use client';

import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

// const menuItems = [
//   { name: "Glow Shotz", price: 100 },
//   { name: "Melon Mania", price: 150 },
//   { name: "Fizz Fix", price: 120 },
//   { name: "TropiCool Bowl", price: 280 },
//   { name: "HK Special Stackwich - Paneer", price: 280 },
//   { name: "HK Special Stackwich - Chicken", price: 320 },
//   { name: "Slider Squad", price: 250 },
//   { name: "Desi Munch", price: 80 },
//   { name: "Dip N’ Drip", price: 250 },
//   { name: "Retro Dippers", price: 250 },
//   { name: "Fruit Bombshell", price: 300 },
// ];
const menuSections = [
  {
    title: "",
    items: [

      { name: "Filter coffee", price: 50 },

    ],
  },
  {
    title: "Drinks",
    items: [
      { name: "Glow Shotz", price: 100 },
      { name: "Melon Mania", price: 150 },
      { name: "Fizz Fix", price: 120 },
      { name: "Tropicool Bowl", price: 280 },
    ],
  },
  {
    title: "QuickBites",
    items: [

      { name: "HK Special Stackwich - Paneer", price: 280 },
      { name: "HK Special Stackwich - Chicken", price: 320 },

      { name: "Slider Squad", price: 250 },
      { name: "Desi Munch", price: 80 },
    ],
  },
  {
    title: "Delicacy",
    items: [

      { name: "Retro Dippers", price: 250 },
      { name: "Fruit Bombshell", price: 300 },
    ],
  },

];


export default function MenuPage() {
  const [cart, setCart] = useState([]);
  const [showBill, setShowBill] = useState(false);
  const [showFinalPrint, setShowFinalPrint] = useState(false);
  const changeQty = (name, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.name === name ? { ...item, quantity: Math.max(item.quantity + delta, 1) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (name) => {
    setCart((prev) => prev.filter((item) => item.name !== name));
  };

  const subTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cgst = subTotal * 0.09;
  const sgst = subTotal * 0.09;
  const salesTax = subTotal * 0.02;
  const total = subTotal + cgst + sgst + salesTax;

  const saveOrder = async () => {
    const order = { items: cart, subTotal, cgst, sgst, salesTax, total };
    const res = await fetch('/api/save-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    const data = await res.json();
    if (data.success) {
      setShowFinalPrint(true);
    } else {
      alert('Failed to save order');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const addItem = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.name === item.name);
      if (existing) {
        return prev.map((i) =>
          i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  return (
    <div className="container py-4">
      {/* {!showBill && !showFinalPrint && (
        <div className="mt-5">
          {menuItems.map((item, index)  => {
            const inCart = cart.find((i) => i.name === item.name);
            return (
              <div key={index} className="d-flex justify-content-between align-items-center border-bottom py-2">
                <div>{item.name}</div>
                <div className="d-flex align-items-center gap-2">
                  <span>₹{item.price}</span>
                  {inCart && <span className="badge bg-success">{inCart.quantity}</span>}
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => addItem(item)}
                  >
                    Add
                  </button>
                </div>
              </div>
            );
          })}
          {cart.length >= 1 && (
            <button
              className="btn btn-success w-100 mt-4"
              onClick={() => setShowBill(true)}
            >
              Check Bill
            </button>
          )}
        </div>
      )} */}

      {!showBill && !showFinalPrint && (
        <div className="mt-5">

          <h2 className="text-center mb-4">HK Cafe Menu</h2>
          {menuSections.map((section, sIndex) => (
            <div key={sIndex} className="mb-4">
              <h5 className="mb-3">{section.title}</h5>
              {section.items.map((item, index) => {
                const inCart = cart.find((i) => i.name === item.name);
                return (
                  <div key={index} className="d-flex justify-content-between align-items-center border-bottom py-2">
                    <div>{item.name}</div>
                    <div className="d-flex align-items-center gap-2">
                      <span>₹{item.price}</span>
                      {inCart && <span className="badge bg-success">{inCart.quantity}</span>}
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => addItem(item)}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          {cart.length >= 1 && (
            <button
              className="btn btn-success w-100 mt-4"
              onClick={() => setShowBill(true)}
            >
              Check Bill
            </button>
          )}
        </div>
      )}


      {/* BILL VIEW */}
      {showBill && !showFinalPrint && (
        <>
          <div className="text-end mb-3">
            <button className="btn btn-warning btn-sm" onClick={() => setShowBill(false)}>
              Add More Items
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => {
                window.location.href = '/'; // Redirects to home
              }}
            >
              Cancel Order
            </button>
          </div>

          <div className="mt-5">
            <h2 className="text-center mb-4">HK Cafe</h2>
            {cart.map((item, index) => (
              <div key={index} className="d-flex justify-content-between align-items-center border-bottom py-2">
                <div>
                  <strong>{item.name}</strong> <br />
                  ₹{item.price} x {item.quantity}
                </div>
                <div>
                  <button
                    className="btn btn-outline-danger btn-sm me-1"
                    onClick={() => changeQty(item.name, -1)}
                  >
                    -
                  </button>
                  <button
                    className="btn btn-outline-success btn-sm me-1"
                    onClick={() => changeQty(item.name, 1)}
                  >
                    +
                  </button>
                  <button
                    className="btn btn-outline-dark btn-sm"
                    onClick={() => removeItem(item.name)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="mt-3 text-end">
              <div className="h4 mt-2">Total: ₹{subTotal.toFixed(2)}</div>
            </div>

            <button className="btn btn-dark w-100 mt-3" onClick={saveOrder}>
              Submit Order
            </button>
          </div>
        </>
      )}
      {showFinalPrint && (
        <div className="mt-5">
          <h2 className="text-center mb-4">HK Cafe</h2>
          <div className="text-center mb-3"></div>
          {cart.map((item, index) => (
            <div key={index} className="d-flex justify-content-between border-bottom py-2">
              <span>{item.name} x {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
          <div className="mt-3 text-end">
            <div className="h4 mt-2">Total: ₹{subTotal.toFixed(2)}</div>
          </div>
          <div className="d-flex justify-content-center gap-3 mt-4">
            <button className="btn btn-primary" onClick={handlePrint}>Print</button>
            <button
              className="btn btn-secondary"
              onClick={() =>
                navigator.share &&
                navigator.share({
                  title: 'Bill',
                  text: 'Check your bill',
                  url: window.location.href,
                })
              }
            >
              Share
            </button>
          </div>
        </div>
      )}
    </div>
  );


  // return (
  //   <div className="container py-4">
  //     {/* MENU VIEW */}
  //     {!showBill && !showFinalPrint && (
  //       <div className="mt-5">
  //         <h2 className="text-center mb-4">HK Cafe Menu</h2>
  //         {menuItems.map((item, index) => {
  //           const inCart = cart.find((i) => i.name === item.name);
  //           return (
  //             <div key={index} className="d-flex flex-column flex-sm-row justify-content-between align-items-center border-bottom py-2">
  //               <div className="text-center text-sm-start">{item.name}</div>
  //               <div className="d-flex align-items-center gap-2 mt-2 mt-sm-0">
  //                 <span className="fw-bold">₹{item.price}</span>
  //                 {inCart && (
  //                   <span className="badge bg-success">{inCart.quantity}</span>
  //                 )}
  //                 <button className="btn btn-sm btn-primary" onClick={() => addItem(item)}>Add</button>
  //               </div>
  //             </div>
  //           );
  //         })}
  //         {cart.length >= 1 && (
  //           <button className="btn btn-success w-100 mt-4" onClick={() => setShowBill(true)}>
  //             Check Bill
  //           </button>
  //         )}
  //       </div>
  //     )}
  //     {showBill && !showFinalPrint && (
  //       <>
  //         <div className="text-end mb-3">
  //           <button className="btn btn-warning btn-sm" onClick={() => setShowBill(false)}>
  //             Add More Items
  //           </button>
  //         </div>

  //         <div className="mt-5">
  //           <h2 className="text-center mb-4">HK Cafe Menu </h2>
  //           {cart.map((item, index) => (
  //             <div key={index} className="d-flex flex-column flex-sm-row justify-content-between align-items-center border-bottom py-2">
  //               <div className="text-center text-sm-start">
  //                 <strong>{item.name}</strong> <br />
  //                 ₹{item.price} x {item.quantity}
  //               </div>
  //               <div className="d-flex flex-wrap gap-1 mt-2 mt-sm-0">
  //                 <button className="btn btn-outline-danger btn-sm" onClick={() => changeQty(item.name, -1)}>-</button>
  //                 <button className="btn btn-outline-success btn-sm" onClick={() => changeQty(item.name, 1)}>+</button>
  //                 <button className="btn btn-outline-dark btn-sm" onClick={() => removeItem(item.name)}>Remove</button>
  //               </div>
  //             </div>
  //           ))}

  //           <div className="mt-3 text-end">
  //             <div>Subtotal: ₹{subTotal.toFixed(2)}</div>
  //             <div>CGST (9%): ₹{cgst.toFixed(2)}</div>
  //             <div>SGST (9%): ₹{sgst.toFixed(2)}</div>
  //             <div>Sales Tax (2%): ₹{salesTax.toFixed(2)}</div>
  //             <div className="h4 mt-2">Total: ₹{total.toFixed(2)}</div>
  //           </div>

  //           <button className="btn btn-dark w-100 mt-3" onClick={saveOrder}>
  //             Submit Order
  //           </button>
  //         </div>
  //       </>
  //     )}
  //     {showFinalPrint && (
  //       <div className="mt-5">
  //         <h2 className="text-center mb-4">HK Cafe</h2>
  //         {cart.map((item, index) => (
  //           <div key={index} className="d-flex justify-content-between border-bottom py-2">
  //             <span>{item.name} x {item.quantity}</span>
  //             <span>₹{item.price * item.quantity}</span>
  //           </div>
  //         ))}
  //         <div className="mt-3 text-end">
  //           <div>Subtotal: ₹{subTotal.toFixed(2)}</div>
  //           <div>CGST (9%): ₹{cgst.toFixed(2)}</div>
  //           <div>SGST (9%): ₹{sgst.toFixed(2)}</div>
  //           <div>Sales Tax (2%): ₹{salesTax.toFixed(2)}</div>
  //           <div className="h4 mt-2">Total: ₹{total.toFixed(2)}</div>
  //         </div>
  //         <div className="d-flex justify-content-center flex-column flex-sm-row gap-3 mt-4">
  //           <button className="btn btn-primary" onClick={handlePrint}>Print</button>
  //           <button
  //             className="btn btn-secondary"
  //             onClick={() => navigator.share && navigator.share({ title: 'HK Cafe Bill', text: 'Check your bill', url: window.location.href })}
  //           >
  //             Share
  //           </button>
  //         </div>
  //       </div>
  //     )}
  //   </div>
  // );

  //   return (
  //     <div className="container py-4">
  //      {!showBill && !showFinalPrint && (
  //   <div className="mt-5">
  //     {menuItems.map((item, index) => {
  //       const inCart = cart.find((i) => i.name === item.name);
  //       return (
  //         <div key={index} className="d-flex justify-content-between align-items-center border-bottom py-2">
  //           <div>{item.name}</div>
  //           <div className="d-flex align-items-center gap-2">
  //             <span>₹{item.price}</span>
  //             {inCart && (
  //               <span className="badge bg-success">{inCart.quantity}</span>
  //             )}
  //             <button
  //               className="btn btn-sm btn-primary"
  //               onClick={() => addItem(item)}
  //             >
  //               Add
  //             </button>
  //           </div>
  //         </div>
  //       );
  //     })}
  //     {cart.length >= 1 && (
  //       <button className="btn btn-success w-100 mt-4" onClick={() => setShowBill(true)}>
  //         Check Bill
  //       </button>
  //     )}
  //   </div>
  // )}


  //       {showBill && !showFinalPrint && (
  //         <>
  //           <div className="text-end mb-3">
  //             <button className="btn btn-warning btn-sm" onClick={() => setShowBill(false)}>
  //               Add More Items
  //             </button>
  //           </div>

  //           <div className="mt-5">
  //             <h2 className="text-center mb-4">HK Cafe Menu</h2>
  //             {cart.map((item, index) => (
  //               <div key={index} className="d-flex justify-content-between align-items-center border-bottom py-2">
  //                 <div>
  //                   <strong>{item.name}</strong> <br />
  //                   ₹{item.price} x {item.quantity}
  //                 </div>
  //                 <div>
  //                   <button className="btn btn-outline-danger btn-sm me-1" onClick={() => changeQty(item.name, -1)}>-</button>
  //                   <button className="btn btn-outline-success btn-sm me-1" onClick={() => changeQty(item.name, 1)}>+</button>
  //                   <button className="btn btn-outline-dark btn-sm" onClick={() => removeItem(item.name)}>Remove</button>
  //                 </div>
  //               </div>
  //             ))}

  //             <div className="mt-3 text-end">
  //               <div>Subtotal: ₹{subTotal.toFixed(2)}</div>
  //               <div>CGST (9%): ₹{cgst.toFixed(2)}</div>
  //               <div>SGST (9%): ₹{sgst.toFixed(2)}</div>
  //               <div>Sales Tax (2%): ₹{salesTax.toFixed(2)}</div>
  //               <div className="h4 mt-2">Total: ₹{total.toFixed(2)}</div>
  //             </div>

  //             <button className="btn btn-dark w-100 mt-3" onClick={saveOrder}>
  //               Submit Order
  //             </button>
  //           </div>
  //         </>
  //       )}

  //       {showFinalPrint && (
  //         <div className="mt-5">
  //           <h2 className="text-center mb-4">HK Cafe</h2>
  //           <div className="text-center mb-3">
  //           </div>
  //           {cart.map((item, index) => (
  //             <div key={index} className="d-flex justify-content-between border-bottom py-2">
  //               <span>{item.name} x {item.quantity}</span>
  //               <span>₹{item.price * item.quantity}</span>
  //             </div>
  //           ))}
  //           <div className="mt-3 text-end">
  //             <div>Subtotal: ₹{subTotal.toFixed(2)}</div>
  //             <div>CGST (9%): ₹{cgst.toFixed(2)}</div>
  //             <div>SGST (9%): ₹{sgst.toFixed(2)}</div>
  //             <div>Sales Tax (2%): ₹{salesTax.toFixed(2)}</div>
  //             <div className="h4 mt-2">Total: ₹{total.toFixed(2)}</div>
  //           </div>
  //           <div className="d-flex justify-content-center gap-3 mt-4">
  //             <button className="btn btn-primary" onClick={handlePrint}>Print</button>
  //             <button className="btn btn-secondary" onClick={() => navigator.share && navigator.share({ title: 'Bill', text: 'Check your bill', url: window.location.href })}>Share</button>
  //           </div>
  //         </div>
  //       )}
  //     </div>
  //   );
}


