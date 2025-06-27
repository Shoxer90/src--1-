export const editPrepaymentCountsModule = async(id,value) => {
    let infuncData = await JSON.parse(localStorage.getItem("isEditPrepayment"))
    if(infuncData) {
        let flag = 0
        let arr = infuncData?.sales?.map((item) => {
          if(item?.id === id) {
            flag+=1
            return {
              ...item,
              count: value
            }
          }else {
            return item
          }
        })
        if(!flag) {
          arr?.push({
            id: id,
            count: value
          })
        }
      return localStorage.setItem("isEditPrepayment",JSON.stringify({...infuncData, sales:arr}))
    }
  }