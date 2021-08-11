
var ref = firebase.database().ref();                           
ref.on("value", function(snapshot){
   console.log(JSON.stringify(snapshot.val(), null, 2));
});
// console.log(firebase);
// var ref = firebase.database().ref('NgoName');
// console.log(ref);
if(document.getElementById("hospitalReg")){
document.getElementById("hospitalReg").addEventListener("submit", function(event){
   alert("Registered successfully");
   event.preventDefault();
   var ngo = {
      hospitalName: document.getElementById("hospital_name").value,
      email: document.getElementById("hospitalemail").value,
      city: document.getElementById("city").value,
      state: document.getElementById("state").value,
      pinCode: document.getElementById("pincode").value
   }
   // console.log(ngo);
   // return(ngo);
    ref.push().set(ngo);
 });
}



