export const numberMatchSymbols = (argument) => {

  const disableSymbols = ["+", "-", "e"];
  let flag = 0
  const string = argument.toString()
  
  disableSymbols.map((symb) => {
    if(string.includes(symb)){
      return flag++
    }
  })
  return Boolean(!flag)
}