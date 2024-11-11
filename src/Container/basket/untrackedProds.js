// export const untrackedProds = async(wishProduct, quantity) => {
//   // it works only from main page and basket content items input
//   let prods = await JSON.parse(localStorage.getItem("untrackedProds")) || []
//   let newUntrackedProdsList= []
//   let flag = 0
//   if(prods?.length) { 
//     newUntrackedProdsList = prods?.map((prod) => {
//       if (prod?.id === (wishProduct?.productId || wishProduct?.id)) {
//         flag+=1
//         return {
//           ...prod,
//           count: quantity
//         }
//       }
//       return prod
//     })
//   }
//   if(!flag) {
//     newUntrackedProdsList = [
//       {
//         count: quantity,
//         id: wishProduct?.productId ? wishProduct?.productId : wishProduct?.id
//       },
//       ...prods
//     ]
//   }
//   localStorage.setItem("untrackedProds", JSON.stringify(newUntrackedProdsList))
// }