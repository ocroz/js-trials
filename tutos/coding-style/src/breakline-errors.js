// No breakline after return
function bad1 () {
  return
  2
}

function bad2 () {
  let i = 1
  return
  (i = 2)
}

console.log(bad1(), bad2())   // undefined undefined
