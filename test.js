// const numer = [2,7,11,15]
// const target = 9
// const comp = {}

// for(let i=0; i< numer.length; i++){
//     console.log(`vuelta: ${i}`)
//     if(comp[numer[i] ]>=0){
//         console.log("entro")
//         console.log(comp[numer[i]])
//         return [ comp[numer[i] ] , i]
//     }
//     comp[target-numer[i]] = i
//     console.log(comp)
// }
// const l1 = [2,4,3]
// const l2 = [5,6,4]

// var addTwoNumbers = function (l1, l2) {
//   let num1 = 0;
//   l1.map((num, index) => {
//     num1 += num * Math.pow(10, index);
//   });

//   let num2 = 0;
//   l2.map((num, index) => {
//     num1 += num * Math.pow(10, index);
//   });

//   let sum = num1 + num2;
//   let res = [];
//   while (sum > 0) {

//     res.push(sum % 10);
//     sum = Math.floor(sum / 10);
//   }
//   console.log(res)
//   return res
// };

// addTwoNumbers(l1,l2)


// // ------
// var longestCommonPrefix = function(strs) {
    
//   const firstWord= strs[0]
//   let prefix= ""
//   for(let i=0; i < firstWord.length; i++){
      
//       for(let j=0; j < strs.length; j++){
//           if(firstWord.charAt(i) != strs[j].charAt(j)){
//               return prefix
//           }
//       }
//       prefix += firstWord.charAt(i)
//   }
//   return prefix
// };

// structuredClone